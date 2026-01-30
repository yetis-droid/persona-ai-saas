import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// JWTペイロードの型定義
export interface JWTPayload {
  userId: string;
  email: string;
}

// Requestに user プロパティを追加
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * JWT認証ミドルウェア
 * クッキーまたはAuthorizationヘッダーからトークンを検証
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // クッキーまたはAuthorizationヘッダーからトークンを取得
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    console.log('[Auth] Request path:', req.path);
    console.log('[Auth] Token found:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('[Auth] Auth header:', req.headers.authorization ? 'present' : 'missing');

    if (!token) {
      console.log('[Auth] No token provided');
      res.status(401).json({ error: '認証が必要です' });
      return;
    }

    // トークンを検証
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    console.log('[Auth] Token verified for user:', decoded.email);
    
    next();
  } catch (error) {
    console.error('[Auth] Authentication error:', error);
    res.status(401).json({ error: '無効なトークンです' });
  }
};

/**
 * JWTトークンを生成
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * リフレッシュトークンを生成
 */
export const generateRefreshToken = (payload: JWTPayload): string => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production';
  return jwt.sign(payload, refreshSecret, { expiresIn: '30d' });
};
