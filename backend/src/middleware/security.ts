// セキュリティミドルウェア: なりすまし防止
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🔐 メール認証必須チェック
 * 重要な操作（人格作成、課金など）はメール認証必須
 */
export const requireEmailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: '未認証です' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isEmailVerified: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        error: 'メール認証が必要です',
        message: `${user.email} に認証メールを送信しました。メールを確認してください。`,
        actionRequired: 'email_verification'
      });
    }

    next();
  } catch (error) {
    console.error('❌ Email verification check error:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
};

/**
 * 🛡️ 管理者専用チェック（公式バッジ付与など）
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || role !== 'admin') {
      return res.status(403).json({
        error: '管理者権限が必要です',
        message: 'この操作は管理者のみ実行できます'
      });
    }

    next();
  } catch (error) {
    console.error('❌ Admin check error:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
};

/**
 * 🚨 不正検知: 異常な操作を検知
 */
export const detectAbnormalBehavior = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return next();
    }

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    // 過去1分間の操作回数をチェック
    const recentActions = await prisma.usageLog.count({
      where: {
        userId,
        createdAt: { gte: oneMinuteAgo }
      }
    });

    // 1分間に30回以上の操作 = 不正の可能性
    if (recentActions > 30) {
      console.warn(`🚨 異常な操作を検知: userId=${userId}, actions=${recentActions}/min`);
      
      // ユーザーをログに記録
      await prisma.usageLog.create({
        data: {
          userId,
          action: 'suspicious_activity_detected',
          metadata: JSON.stringify({
            actionsPerMinute: recentActions,
            endpoint: req.path,
            method: req.method,
            ip: req.ip
          })
        }
      });

      return res.status(429).json({
        error: '操作が多すぎます',
        message: '少し時間をおいてから再度お試しください',
        retryAfter: 60
      });
    }

    next();
  } catch (error) {
    console.error('❌ Abnormal behavior detection error:', error);
    next(); // エラーでもリクエストは続行
  }
};

/**
 * 📊 操作ログを記録（監査用）
 */
export const logAction = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      
      if (userId) {
        await prisma.usageLog.create({
          data: {
            userId,
            action,
            metadata: JSON.stringify({
              endpoint: req.path,
              method: req.method,
              ip: req.ip,
              userAgent: req.get('user-agent')
            })
          }
        });
      }

      next();
    } catch (error) {
      console.error('❌ Log action error:', error);
      next(); // ログ失敗でもリクエストは続行
    }
  };
};
