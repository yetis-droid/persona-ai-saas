import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { generateToken, generateRefreshToken, authenticate } from '../middleware/auth';
import { OAuth2Client } from 'google-auth-library';

const router = Router();
const prisma = new PrismaClient();

// Google OAuth クライアント
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /api/auth/signup
 * ユーザー登録
 */
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
    body('password').isLength({ min: 8 }).withMessage('パスワードは8文字以上である必要があります'),
    body('name').optional().trim()
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // バリデーション
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
      }

      const { email, password, name } = req.body;

      // 既存ユーザーチェック
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        res.status(400).json({ error: 'このメールアドレスは既に登録されています' });
        return;
      }

      // パスワードハッシュ化
      const passwordHash = await bcrypt.hash(password, 10);

      // ユーザー作成
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name: name || null
        }
      });

      // トークン生成
      const token = generateToken({ userId: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

      // HTTPOnlyクッキーにトークンを設定
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7日
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30日
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          subscriptionStatus: user.subscriptionStatus
        },
        token
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'ユーザー登録中にエラーが発生しました' });
    }
  }
);

/**
 * POST /api/auth/login
 * ログイン
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
    body('password').notEmpty().withMessage('パスワードを入力してください')
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // バリデーション
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
      }

      const { email, password } = req.body;

      // ユーザー検索
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user || !user.passwordHash) {
        res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません' });
        return;
      }

      // パスワード検証
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません' });
        return;
      }

      // トークン生成
      const token = generateToken({ userId: user.id, email: user.email, role: user.role });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

      // HTTPOnlyクッキーにトークンを設定
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7日
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30日
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          subscriptionStatus: user.subscriptionStatus
        },
        token
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'ログイン中にエラーが発生しました' });
    }
  }
);

/**
 * POST /api/auth/google
 * Google OAuth認証
 */
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res.status(400).json({ error: 'Google認証情報が必要です' });
      return;
    }

    // Google トークンを検証
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      res.status(400).json({ error: '無効なGoogle認証情報です' });
      return;
    }

    const { email, sub: googleId, name } = payload;

    // 既存ユーザーを検索または作成
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { googleId }
        ]
      }
    });

    if (!user) {
      // 新規ユーザー作成
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          name: name || null
        }
      });
    } else if (!user.googleId) {
      // 既存ユーザーにgoogleIdを追加
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId }
      });
    }

    // トークン生成（roleを含める）
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });

    // HTTPOnlyクッキーにトークンを設定
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7日
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30日
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus
      },
      token
    });
  } catch (error: any) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google認証中にエラーが発生しました' });
  }
});

/**
 * POST /api/auth/logout
 * ログアウト
 */
router.post('/logout', (req: Request, res: Response): void => {
  // クッキーをクリア
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ message: 'ログアウトしました' });
});

/**
 * GET /api/auth/me
 * 現在のユーザー情報取得
 */
router.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'ユーザーが見つかりません' });
      return;
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'ユーザー情報の取得中にエラーが発生しました' });
  }
});

export default router;
