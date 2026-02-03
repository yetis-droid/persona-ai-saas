import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 管理者認証ミドルウェア
 * authenticate ミドルウェアの後に使用する
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // authenticate ミドルウェアで設定された userId を取得
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: '認証が必要です' });
    }

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'ユーザーが見つかりません' });
    }

    // 管理者権限チェック
    if (user.role !== 'admin') {
      return res.status(403).json({ error: '管理者権限が必要です' });
    }

    // 管理者情報を req に追加
    (req as any).admin = {
      userId: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('❌ 管理者認証エラー:', error);
    res.status(500).json({ error: '管理者認証に失敗しました' });
  }
};
