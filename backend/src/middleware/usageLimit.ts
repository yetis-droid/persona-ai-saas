import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// プラン別の制限
const PLAN_LIMITS = {
  free: {
    dailyConversations: 3, // 10 → 3 に変更（コスト削減）
    maxPersonas: 1,
    lineIntegration: false,
  },
  premium: {
    dailyConversations: 100,
    maxPersonas: 3,
    lineIntegration: true,
  },
  ticket: {
    // チケット保有者は実質無制限（前払い済み）
    dailyConversations: 999999,
    maxPersonas: 3,
    lineIntegration: true,
  },
};

/**
 * 使用量制限をチェックするミドルウェア
 */
export const checkUsageLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // authミドルウェアで設定された req.user.userId を取得
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: '認証が必要です' });
    }

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    // チケット優先ロジック（前払い・リスクゼロ）
    const hasTickets = user.ticketBalance && user.ticketBalance > 0;
    
    // プラン制限を取得
    let limits;
    if (hasTickets) {
      // チケットがある場合は実質無制限（前払い済み）
      limits = PLAN_LIMITS.ticket;
    } else {
      limits = PLAN_LIMITS[user.subscriptionTier as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
    }

    // 日付が変わったらカウンターをリセット
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastConversationDate = user.lastConversationDate
      ? new Date(user.lastConversationDate)
      : null;
    
    if (!lastConversationDate || lastConversationDate < today) {
      // 日付が変わった or 初回
      await prisma.user.update({
        where: { id: userId },
        data: {
          dailyConversationCount: 0,
          lastConversationDate: new Date(),
        },
      });
      
      user.dailyConversationCount = 0;
    }

    // 制限チェック
    if (hasTickets) {
      // チケットがある場合は制限なし（前払い済み）
      // チケット残高のみチェック
      if (user.ticketBalance <= 0) {
        return res.status(429).json({
          error: 'チケットがありません',
          balance: user.ticketBalance,
          message: 'チケットを購入すると、いつでも好きなだけ会話できます。',
          canPurchaseTickets: true
        });
      }
    } else {
      // 無料/プレミアムの場合は日次制限をチェック
      if (user.dailyConversationCount >= limits.dailyConversations) {
        return res.status(429).json({
          error: '本日の会話上限に達しました',
          limit: limits.dailyConversations,
          used: user.dailyConversationCount,
          message: user.subscriptionTier === 'free'
            ? 'チケットを購入するか、プレミアムプランにアップグレードすると、もっと会話できます。'
            : '明日また利用できます。',
          canPurchaseTickets: true
        });
      }
    }

    // リクエストにユーザー情報と制限情報を追加
    // 注意: req.userは authミドルウェアで設定済み（{userId, email}）なので上書きしない
    (req as any).userDetails = user;
    (req as any).limits = limits;

    next();
  } catch (error) {
    console.error('Usage limit check error:', error);
    res.status(500).json({ error: '使用量チェックに失敗しました' });
  }
};

/**
 * 会話カウントを増やす（チケット消費を含む）
 */
export const incrementConversationCount = async (userId: string) => {
  // ユーザー情報取得
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ticketBalance: true,
      dailyConversationCount: true
    }
  });

  const hasTickets = user && user.ticketBalance > 0;

  if (hasTickets) {
    // チケット消費（前払い済みなのでコストゼロ）
    await prisma.user.update({
      where: { id: userId },
      data: {
        ticketBalance: {
          decrement: 1
        },
        dailyConversationCount: {
          increment: 1
        },
        lastConversationDate: new Date(),
      },
    });

    console.log(`🎫 Ticket consumed for user ${userId}, remaining: ${(user.ticketBalance || 0) - 1}`);
  } else {
    // 通常の日次カウント増加
    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyConversationCount: {
          increment: 1,
        },
        lastConversationDate: new Date(),
      },
    });
  }

  // 使用ログを記録
  await prisma.usageLog.create({
    data: {
      userId,
      action: 'conversation',
      metadata: JSON.stringify({ 
        timestamp: new Date(),
        usedTicket: hasTickets 
      }),
    },
  });
};

/**
 * 人格作成数をチェック
 */
export const checkPersonaLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // authミドルウェアで設定された req.user.userId を取得
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: '認証が必要です' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        personas: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    const limits = PLAN_LIMITS[user.subscriptionTier as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

    if (user.personas.length >= limits.maxPersonas) {
      return res.status(403).json({
        error: '人格作成数の上限に達しました',
        limit: limits.maxPersonas,
        current: user.personas.length,
        message: user.subscriptionTier === 'free'
          ? 'プレミアムプランにアップグレードすると、3個まで作成できます。'
          : 'これ以上人格を作成できません。',
      });
    }

    next();
  } catch (error) {
    console.error('Persona limit check error:', error);
    res.status(500).json({ error: '人格数チェックに失敗しました' });
  }
};

export default {
  checkUsageLimit,
  incrementConversationCount,
  checkPersonaLimit,
  PLAN_LIMITS,
};
