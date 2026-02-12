// 管理者専用: 公式バッジ管理API
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { requireAdmin, logAction } from '../middleware/security';

const router = Router();
const prisma = new PrismaClient();

/**
 * 🔐 公式バッジを付与（管理者のみ）
 * POST /api/admin/verify-user
 */
router.post('/verify-user', authenticate, requireAdmin, logAction('grant_official_badge'), async (req, res) => {
  try {
    const { userId, badgeType } = req.body;
    const adminId = req.user?.userId;

    // バリデーション
    const validBadgeTypes = ['creator', 'partner', 'verified'];
    if (!validBadgeTypes.includes(badgeType)) {
      return res.status(400).json({
        error: '無効なバッジタイプです',
        validTypes: validBadgeTypes
      });
    }

    // 対象ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, isOfficialAccount: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    // すでに公式アカウントの場合
    if (user.isOfficialAccount) {
      return res.status(400).json({
        error: 'すでに公式アカウントです',
        user
      });
    }

    // 公式バッジを付与
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isOfficialAccount: true,
        officialBadge: badgeType,
        verificationLevel: 3,
        isEmailVerified: true // 公式認証時は自動的にメール認証も完了
      }
    });

    // 監査ログ
    await prisma.usageLog.create({
      data: {
        userId: adminId!,
        action: 'grant_official_badge',
        metadata: JSON.stringify({
          targetUserId: userId,
          targetEmail: user.email,
          badgeType,
          timestamp: new Date().toISOString()
        })
      }
    });

    console.log(`✅ 公式バッジ付与: ${user.email} → ${badgeType} (by admin: ${adminId})`);

    res.json({
      success: true,
      message: `${user.name || user.email} に公式バッジ「${badgeType}」を付与しました`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isOfficialAccount: updatedUser.isOfficialAccount,
        officialBadge: updatedUser.officialBadge,
        verificationLevel: updatedUser.verificationLevel
      }
    });
  } catch (error) {
    console.error('❌ Grant official badge error:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

/**
 * 🚫 公式バッジを剥奪（管理者のみ）
 * POST /api/admin/revoke-badge
 */
router.post('/revoke-badge', authenticate, requireAdmin, logAction('revoke_official_badge'), async (req, res) => {
  try {
    const { userId, reason } = req.body;
    const adminId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    if (!user.isOfficialAccount) {
      return res.status(400).json({ error: 'このユーザーは公式アカウントではありません' });
    }

    // バッジを剥奪
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isOfficialAccount: false,
        officialBadge: null,
        verificationLevel: 1
      }
    });

    // 監査ログ
    await prisma.usageLog.create({
      data: {
        userId: adminId!,
        action: 'revoke_official_badge',
        metadata: JSON.stringify({
          targetUserId: userId,
          targetEmail: user.email,
          previousBadge: user.officialBadge,
          reason,
          timestamp: new Date().toISOString()
        })
      }
    });

    console.log(`⚠️ 公式バッジ剥奪: ${user.email} (理由: ${reason})`);

    res.json({
      success: true,
      message: '公式バッジを剥奪しました',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        isOfficialAccount: updatedUser.isOfficialAccount
      }
    });
  } catch (error) {
    console.error('❌ Revoke badge error:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

/**
 * 📋 公式アカウント一覧取得（管理者のみ）
 * GET /api/admin/official-accounts
 */
router.get('/official-accounts', authenticate, requireAdmin, async (req, res) => {
  try {
    const officialAccounts = await prisma.user.findMany({
      where: { isOfficialAccount: true },
      select: {
        id: true,
        email: true,
        name: true,
        officialBadge: true,
        verificationLevel: true,
        createdAt: true,
        emailVerifiedAt: true,
        _count: {
          select: {
            personas: true,
            usageLogs: true
          }
        }
      },
      orderBy: { verificationLevel: 'desc' }
    });

    res.json({
      total: officialAccounts.length,
      accounts: officialAccounts
    });
  } catch (error) {
    console.error('❌ Get official accounts error:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

/**
 * 🚨 人格を停止（なりすまし対策）
 * POST /api/admin/suspend-persona
 */
router.post('/suspend-persona', authenticate, requireAdmin, logAction('suspend_persona'), async (req, res) => {
  try {
    const { personaId, reason } = req.body;
    const adminId = req.user?.userId;

    const persona = await prisma.persona.findUnique({
      where: { id: personaId },
      include: { user: true }
    });

    if (!persona) {
      return res.status(404).json({ error: '人格が見つかりません' });
    }

    // 人格を停止
    const updatedPersona = await prisma.persona.update({
      where: { id: personaId },
      data: {
        isSuspended: true,
        suspendedReason: reason,
        isActive: false
      }
    });

    // 監査ログ
    await prisma.usageLog.create({
      data: {
        userId: adminId!,
        action: 'suspend_persona',
        metadata: JSON.stringify({
          personaId,
          userId: persona.userId,
          userEmail: persona.user.email,
          reason,
          timestamp: new Date().toISOString()
        })
      }
    });

    console.log(`🚫 人格を停止: ${personaId} (理由: ${reason})`);

    res.json({
      success: true,
      message: '人格を停止しました',
      persona: {
        id: updatedPersona.id,
        isSuspended: updatedPersona.isSuspended,
        suspendedReason: updatedPersona.suspendedReason
      }
    });
  } catch (error) {
    console.error('❌ Suspend persona error:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

export default router;
