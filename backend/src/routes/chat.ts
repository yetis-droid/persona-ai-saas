import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { generateAIReply, containsNGTopic, SAFE_REFUSAL_MESSAGE } from '../utils/claudeApi';
import { checkUsageLimit, incrementConversationCount } from '../middleware/usageLimit';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/chat
 * チャット送信
 */
router.post(
  '/',
  authenticate,
  checkUsageLimit, // 使用量制限チェックを追加
  [
    body('personaId').notEmpty().withMessage('人格IDが必要です'),
    body('message').notEmpty().withMessage('メッセージを入力してください')
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // バリデーション
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
      }

      const { personaId, message } = req.body;

      // 1. 人格の存在確認と所有権チェック
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

      // 2. 固定NG話題チェック（ユーザーメッセージ）
      if (containsNGTopic(message)) {
        // NG検知された場合は即座に安全文で返す
        await prisma.conversation.create({
          data: {
            personaId,
            source: 'web',
            userMessage: message,
            aiReply: SAFE_REFUSAL_MESSAGE,
            isNgDetected: true
          }
        });

        res.json({
          reply: SAFE_REFUSAL_MESSAGE,
          isNgDetected: true
        });
        return;
      }

      // 3. Claude API呼び出し
      let aiReply: string;
      try {
        aiReply = await generateAIReply(persona.systemPrompt, message);
      } catch (error: any) {
        console.error('AI generation error:', error);
        res.status(500).json({ error: 'AI応答の生成中にエラーが発生しました' });
        return;
      }

      // 4. AI返信のNG話題チェック
      if (containsNGTopic(aiReply)) {
        // AI返信にNG話題が含まれていた場合も安全文に差し替え
        aiReply = SAFE_REFUSAL_MESSAGE;

        await prisma.conversation.create({
          data: {
            personaId,
            source: 'web',
            userMessage: message,
            aiReply,
            isNgDetected: true
          }
        });

        res.json({
          reply: aiReply,
          isNgDetected: true
        });
        return;
      }

      // 5. 会話ログ保存
      const conversation = await prisma.conversation.create({
        data: {
          personaId,
          source: 'web',
          userMessage: message,
          aiReply,
          isNgDetected: false
        }
      });

      // 6. 会話カウントを増やす
      console.log('💬 Chat: Incrementing conversation count for user:', req.user?.userId);
      console.log('💬 Chat: req.user:', req.user);
      
      if (!req.user?.userId) {
        console.error('❌ Chat: req.user.userId is undefined!');
        throw new Error('User ID is undefined');
      }
      
      await incrementConversationCount(req.user.userId);

      res.json({
        reply: aiReply,
        conversationId: conversation.id,
        isNgDetected: false
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'チャット送信中にエラーが発生しました' });
    }
  }
);

/**
 * GET /api/chat/conversations
 * 会話ログ取得
 */
router.get('/conversations', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { personaId, limit = '50', offset = '0' } = req.query;

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

    // 会話ログ取得
    const conversations = await prisma.conversation.findMany({
      where: { personaId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    // 総数取得
    const total = await prisma.conversation.count({
      where: { personaId }
    });

    res.json({
      conversations,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: '会話ログの取得中にエラーが発生しました' });
  }
});

/**
 * PUT /api/chat/conversations/:id/rating
 * 会話評価更新
 */
router.put(
  '/conversations/:id/rating',
  authenticate,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('評価は1-5の範囲で入力してください')
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // バリデーション
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
      }

      const conversationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { rating } = req.body;

      // 会話の存在確認と所有権チェック
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId },
        include: { persona: true }
      });

      if (!conversation) {
        res.status(404).json({ error: '会話が見つかりません' });
        return;
      }

      if (conversation.persona.userId !== req.user!.userId) {
        res.status(403).json({ error: 'この会話にアクセスする権限がありません' });
        return;
      }

      // 評価更新
      const updatedConversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: { rating: parseInt(rating) }
      });

      res.json({ conversation: updatedConversation });
    } catch (error: any) {
      console.error('Update rating error:', error);
      res.status(500).json({ error: '評価更新中にエラーが発生しました' });
    }
  }
);

export default router;
