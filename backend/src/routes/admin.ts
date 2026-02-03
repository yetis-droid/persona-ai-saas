import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * 📊 管理者ダッシュボード統計情報取得
 * GET /api/admin/stats
 */
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    // ユーザー統計
    const totalUsers = await prisma.user.count();
    const premiumUsers = await prisma.user.count({
      where: { subscriptionTier: 'premium' }
    });
    const freeUsers = totalUsers - premiumUsers;

    // 会話統計
    const totalConversations = await prisma.conversation.count();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayConversations = await prisma.conversation.count({
      where: { createdAt: { gte: todayStart } }
    });

    // 人格統計
    const totalPersonas = await prisma.persona.count();
    const activePersonas = await prisma.persona.count({
      where: { isActive: true }
    });

    // 収益統計（チケット購入履歴から計算）
    const users = await prisma.user.findMany({
      select: { ticketPurchaseHistory: true }
    });

    let totalTicketRevenue = 0;
    let totalTicketsSold = 0;
    users.forEach((user: any) => {
      const history = Array.isArray(user.ticketPurchaseHistory) 
        ? user.ticketPurchaseHistory 
        : [];
      history.forEach((purchase: any) => {
        if (purchase.amount) {
          totalTicketRevenue += purchase.amount;
        }
        if (purchase.tickets) {
          totalTicketsSold += purchase.tickets;
        }
      });
    });

    // サブスク収益（Premium ユーザー数 × 980円）
    const monthlySubRevenue = premiumUsers * 980;

    // 今月のサブスク収益（簡易計算）
    const totalSubRevenue = monthlySubRevenue;

    // 広告収益（仮の計算: 無料ユーザー × 平均¥5/月）
    const estimatedAdRevenue = freeUsers * 5;

    res.json({
      users: {
        total: totalUsers,
        free: freeUsers,
        premium: premiumUsers
      },
      conversations: {
        total: totalConversations,
        today: todayConversations
      },
      personas: {
        total: totalPersonas,
        active: activePersonas
      },
      revenue: {
        totalTickets: totalTicketRevenue,
        totalSubscription: totalSubRevenue,
        estimatedAds: estimatedAdRevenue,
        total: totalTicketRevenue + totalSubRevenue + estimatedAdRevenue
      },
      tickets: {
        sold: totalTicketsSold,
        revenue: totalTicketRevenue
      }
    });
  } catch (error) {
    console.error('❌ 管理者統計取得エラー:', error);
    res.status(500).json({ error: '統計情報の取得に失敗しました' });
  }
});

/**
 * 👥 全ユーザー一覧取得
 * GET /api/admin/users
 */
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        dailyConversationCount: true,
        ticketBalance: true,
        createdAt: true,
        _count: {
          select: {
            personas: true,
            usageLogs: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('❌ ユーザー一覧取得エラー:', error);
    res.status(500).json({ error: 'ユーザー一覧の取得に失敗しました' });
  }
});

/**
 * ✏️ ユーザープラン変更
 * PATCH /api/admin/users/:userId/plan
 */
router.patch('/users/:userId/plan', authenticate, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.userId as string;
    const { tier } = req.body;

    if (!['free', 'premium'].includes(tier)) {
      return res.status(400).json({ error: '無効なプランです' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: tier === 'premium' ? 'active' : 'inactive'
      }
    });

    res.json({ message: 'プランを変更しました', user });
  } catch (error) {
    console.error('❌ プラン変更エラー:', error);
    res.status(500).json({ error: 'プラン変更に失敗しました' });
  }
});

/**
 * 🎫 ユーザーチケット付与
 * POST /api/admin/users/:userId/tickets
 */
router.post('/users/:userId/tickets', authenticate, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.userId as string;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: '無効なチケット数です' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ticketBalance: { increment: amount }
      }
    });

    res.json({ 
      message: `${amount}チケットを付与しました`,
      newBalance: user.ticketBalance
    });
  } catch (error) {
    console.error('❌ チケット付与エラー:', error);
    res.status(500).json({ error: 'チケット付与に失敗しました' });
  }
});

/**
 * 🗑️ ユーザー削除
 * DELETE /api/admin/users/:userId
 */
router.delete('/users/:userId', authenticate, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.userId as string;

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'ユーザーを削除しました' });
  } catch (error) {
    console.error('❌ ユーザー削除エラー:', error);
    res.status(500).json({ error: 'ユーザー削除に失敗しました' });
  }
});

/**
 * 🤖 全人格一覧取得
 * GET /api/admin/personas
 */
router.get('/personas', authenticate, requireAdmin, async (req, res) => {
  try {
    const personas = await prisma.persona.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        _count: {
          select: {
            conversations: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ personas });
  } catch (error) {
    console.error('❌ 人格一覧取得エラー:', error);
    res.status(500).json({ error: '人格一覧の取得に失敗しました' });
  }
});

/**
 * ✏️ 人格の有効/無効切り替え
 * PATCH /api/admin/personas/:personaId/toggle
 */
router.patch('/personas/:personaId/toggle', authenticate, requireAdmin, async (req, res) => {
  try {
    const personaId = req.params.personaId as string;

    const persona = await prisma.persona.findUnique({
      where: { id: personaId }
    });

    if (!persona) {
      return res.status(404).json({ error: '人格が見つかりません' });
    }

    const updated = await prisma.persona.update({
      where: { id: personaId },
      data: { isActive: !persona.isActive }
    });

    res.json({ 
      message: `人格を${updated.isActive ? '有効' : '無効'}にしました`,
      persona: updated
    });
  } catch (error) {
    console.error('❌ 人格切り替えエラー:', error);
    res.status(500).json({ error: '人格の切り替えに失敗しました' });
  }
});

/**
 * 🗑️ 人格削除
 * DELETE /api/admin/personas/:personaId
 */
router.delete('/personas/:personaId', authenticate, requireAdmin, async (req, res) => {
  try {
    const personaId = req.params.personaId as string;

    await prisma.persona.delete({
      where: { id: personaId }
    });

    res.json({ message: '人格を削除しました' });
  } catch (error) {
    console.error('❌ 人格削除エラー:', error);
    res.status(500).json({ error: '人格削除に失敗しました' });
  }
});

/**
 * 💰 収益詳細取得
 * GET /api/admin/revenue
 */
router.get('/revenue', authenticate, requireAdmin, async (req, res) => {
  try {
    // チケット購入履歴
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        ticketPurchaseHistory: true
      }
    });

    const ticketPurchases: any[] = [];
    users.forEach((user: any) => {
      const history = Array.isArray(user.ticketPurchaseHistory) 
        ? user.ticketPurchaseHistory 
        : [];
      history.forEach((purchase: any) => {
        ticketPurchases.push({
          userId: user.id,
          email: user.email,
          date: purchase.date,
          tickets: purchase.tickets,
          amount: purchase.amount,
          sessionId: purchase.sessionId
        });
      });
    });

    // 日付順にソート
    ticketPurchases.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // サブスク収益
    const premiumUsers = await prisma.user.findMany({
      where: { subscriptionTier: 'premium' },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionStatus: true,
        createdAt: true
      }
    });

    res.json({
      tickets: ticketPurchases,
      subscriptions: premiumUsers.map(u => ({
        userId: u.id,
        email: u.email,
        name: u.name,
        status: u.subscriptionStatus,
        monthlyRevenue: 980,
        startDate: u.createdAt
      }))
    });
  } catch (error) {
    console.error('❌ 収益詳細取得エラー:', error);
    res.status(500).json({ error: '収益詳細の取得に失敗しました' });
  }
});

export default router;
