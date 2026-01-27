import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { generateAIReply, containsNGTopic, SAFE_REFUSAL_MESSAGE } from '../utils/claudeApi';

const router = Router();
const prisma = new PrismaClient();

/**
 * LINE Webhook署名検証
 */
function verifySignature(body: string, signature: string, channelSecret: string): boolean {
  const hash = crypto
    .createHmac('SHA256', channelSecret)
    .update(body)
    .digest('base64');
  return hash === signature;
}

/**
 * LINEにメッセージを送信
 */
async function sendLineReply(
  replyToken: string,
  message: string,
  channelAccessToken: string
): Promise<void> {
  const response = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${channelAccessToken}`
    },
    body: JSON.stringify({
      replyToken,
      messages: [
        {
          type: 'text',
          text: message
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LINE API error: ${error}`);
  }
}

/**
 * POST /api/line/webhook/:personaId
 * LINE Webhook
 */
router.post('/webhook/:personaId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { personaId } = req.params;

    // 1. 人格取得
    const persona = await prisma.persona.findUnique({
      where: { id: personaId }
    });

    if (!persona || !persona.lineChannelAccessToken || !persona.lineChannelSecret) {
      res.status(404).json({ error: 'LINE連携が設定されていません' });
      return;
    }

    // 2. 署名検証
    const signature = req.headers['x-line-signature'] as string;
    const body = JSON.stringify(req.body);

    if (!verifySignature(body, signature, persona.lineChannelSecret)) {
      res.status(401).json({ error: '署名検証に失敗しました' });
      return;
    }

    // 3. イベント処理
    const events = req.body.events || [];

    for (const event of events) {
      // メッセージイベントのみ処理
      if (event.type !== 'message' || event.message.type !== 'text') {
        continue;
      }

      const userMessage = event.message.text;
      const replyToken = event.replyToken;
      const fanLineId = event.source.userId;

      let aiReply: string;

      // 4. NG話題チェック
      if (containsNGTopic(userMessage)) {
        aiReply = SAFE_REFUSAL_MESSAGE;

        // 会話ログ保存
        await prisma.conversation.create({
          data: {
            personaId,
            source: 'line',
            fanLineId,
            userMessage,
            aiReply,
            isNgDetected: true
          }
        });
      } else {
        // 5. AI応答生成
        try {
          aiReply = await generateAIReply(persona.systemPrompt, userMessage);

          // AI返信のNG話題チェック
          if (containsNGTopic(aiReply)) {
            aiReply = SAFE_REFUSAL_MESSAGE;
          }

          // 会話ログ保存
          await prisma.conversation.create({
            data: {
              personaId,
              source: 'line',
              fanLineId,
              userMessage,
              aiReply,
              isNgDetected: containsNGTopic(aiReply)
            }
          });
        } catch (error: any) {
          console.error('AI generation error:', error);
          aiReply = 'ごめんなさい、今は応答できません。しばらくしてから再度お試しください。';
        }
      }

      // 6. LINEに返信
      try {
        await sendLineReply(replyToken, aiReply, persona.lineChannelAccessToken);
      } catch (error: any) {
        console.error('LINE reply error:', error);
      }
    }

    // LINE側には必ず200を返す
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('LINE webhook error:', error);
    // LINE側には200を返す（エラーでもリトライを防ぐ）
    res.status(200).json({ success: false });
  }
});

export default router;
