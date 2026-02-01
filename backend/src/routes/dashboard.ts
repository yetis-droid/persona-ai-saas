import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/dashboard
 * ダッシュボード統計情報取得
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { personaId } = req.query;

    if (!personaId || typeof personaId !== 'string') {
      res.status(400).json({ error: '人格IDが必要です' });
      return;
    }

    // 所有権チェック
    const persona = await prisma.persona.findFirst({
      where: {
        id: personaId,
        userId: req.user!.userId
      }
    });

    if (!persona) {
      res.status(404).json({ error: '人格が見つかりません' });
      return;
    }

    // 統計情報を取得
    const [
      totalConversations,
      webConversations,
      lineConversations,
      ngDetectedCount,
      averageRating,
      ratingDistribution,
      dailyConversations
    ] = await Promise.all([
      // 総会話数
      prisma.conversation.count({
        where: { personaId }
      }),
      
      // Web会話数
      prisma.conversation.count({
        where: { personaId, source: 'web' }
      }),
      
      // LINE会話数
      prisma.conversation.count({
        where: { personaId, source: 'line' }
      }),
      
      // NG検知数
      prisma.conversation.count({
        where: { personaId, isNgDetected: true }
      }),
      
      // 平均評価
      prisma.conversation.aggregate({
        where: {
          personaId,
          rating: { not: null }
        },
        _avg: {
          rating: true
        }
      }),
      
      // 評価分布
      prisma.$queryRaw`
        SELECT rating, COUNT(*) as count
        FROM "Conversation"
        WHERE "personaId" = ${personaId}
        AND rating IS NOT NULL
        GROUP BY rating
        ORDER BY rating
      ` as Promise<Array<{ rating: number; count: bigint }>>,
      
      // 過去30日の日別会話数
      prisma.$queryRaw`
        SELECT 
          DATE("createdAt") as date,
          COUNT(*) as count
        FROM "Conversation"
        WHERE "personaId" = ${personaId}
        AND "createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
      ` as Promise<Array<{ date: Date; count: bigint }>>
    ]);

    // 評価分布を整形
    const ratingDist = [1, 2, 3, 4, 5].map(rating => {
      const found = ratingDistribution.find(r => r.rating === rating);
      return {
        rating,
        count: found ? Number(found.count) : 0
      };
    });

    // 日別会話数を整形
    const dailyStats = dailyConversations.map(item => ({
      date: item.date.toISOString().split('T')[0],
      count: Number(item.count)
    }));

    res.json({
      personaId,
      totalConversations,
      webConversations,
      lineConversations,
      ngDetectedCount,
      averageRating: averageRating._avg.rating || 0,
      ratingDistribution: ratingDist,
      dailyConversations: dailyStats
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'ダッシュボード情報の取得中にエラーが発生しました' });
  }
});

/**
 * GET /api/dashboard/usage
 * 使用状況取得（サブスクリプション機能が無効な場合の簡易版）
 */
router.get('/usage', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    
    // 今日の日付（00:00:00）を取得
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 今日の会話数をカウント
    const todayCount = await prisma.conversation.count({
      where: {
        persona: {
          userId
        },
        createdAt: {
          gte: today
        }
      }
    });
    
    // 簡易的なプラン情報（Stripe機能が無効なのでデフォルト値）
    res.json({
      todayCount,
      limit: 10, // 無料プランのデフォルト制限
      planName: 'Free',
      resetTime: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString() // 明日の00:00
    });
  } catch (error: any) {
    console.error('Usage stats error:', error);
    res.status(500).json({ error: '使用状況の取得中にエラーが発生しました' });
  }
});

export default router;
