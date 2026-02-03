import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { checkPersonaLimit } from '../middleware/usageLimit';

const router = Router();
const prisma = new PrismaClient();

/**
 * システムプロンプトを生成
 */
function generateSystemPrompt(formData: any): string {
  return `あなたは「${formData.creatorCallname}」の活動窓口AIです。本人ではありません。

【絶対厳守ルール】
1. 本人になりすます表現を絶対に使わない（「私は◯◯です」等禁止）
2. 以下の話題には必ず断る: 恋愛、政治、宗教、医療、法律、投資、他者批判、個人情報
3. 医療/法律/投資の助言、診断、命令は禁止
4. 依存を誘発する表現（「いつでも私だけに」等）禁止
5. グレーゾーンは安全側に倒して断る

【断る時の例文】
「その質問にはお答えできません。もし詳しく知りたい場合は、本人に直接お問い合わせください。」

【基本情報】
- 活動ジャンル: ${formData.genre}
- 一言説明: ${formData.oneLiner}
- クリエイター呼び名: ${formData.creatorCallname}
- ファン呼び名: ${formData.fanCallname}

【話し方】
- 口調: ${formData.tone}
- 丁寧度: ${formData.politenessLevel}/5
- 絵文字使用: ${formData.emojiUsage}
- 返信の長さ: ${formData.replyLength}
- よく使う言い回し: ${formData.phrasingExamples}
- 使わない言葉: ${formData.bannedPhrases}

【距離感/境界線】
- 距離感タイプ: ${formData.relationshipStyle}
- 雑談許容度: ${formData.smalltalkLevel}
- 対応範囲: ${formData.supportScope}
- 断り方: ${formData.refusalStyle}
- 境界線: ${formData.boundaries}

【世界観/価値観】
- キーワード: ${formData.worldKeywords}
- 価値観: ${formData.coreValues}
- 一貫性ルール: ${formData.consistencyRule}

【FAQ】
${formData.faqPairs}

【追加NG話題】
${formData.ngTopicsExtra}

【共有情報】
リンク: ${formData.shareLinks}
固定情報: ${formData.shareInfo}
`.trim();
}

/**
 * GET /api/personas
 * 人格一覧取得
 */
router.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const personas = await prisma.persona.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        genre: true,
        oneLiner: true,
        creatorCallname: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { conversations: true }
        }
      }
    });

    res.json({ personas });
  } catch (error: any) {
    console.error('Get personas error:', error);
    res.status(500).json({ error: '人格一覧の取得中にエラーが発生しました' });
  }
});

/**
 * POST /api/personas
 * 人格作成
 */
router.post(
  '/',
  authenticate,
  checkPersonaLimit, // 人格数制限チェックを追加
  [
    body('genre').notEmpty().withMessage('活動ジャンルを入力してください'),
    body('oneLiner').notEmpty().withMessage('一言説明を入力してください'),
    body('creatorCallname').notEmpty().withMessage('呼ばれたい名前を入力してください'),
    body('fanCallname').notEmpty().withMessage('ファンの呼び方を入力してください'),
    body('tone').notEmpty().withMessage('話し方を入力してください'),
    body('politenessLevel').isInt({ min: 1, max: 5 }).withMessage('丁寧度は1-5の範囲で入力してください'),
    body('emojiUsage').notEmpty().withMessage('絵文字頻度を入力してください'),
    body('replyLength').notEmpty().withMessage('返信の長さを入力してください')
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      // バリデーション
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return;
      }

      const formData = req.body;
      
      // システムプロンプトを生成
      const systemPrompt = generateSystemPrompt(formData);

      // 人格を作成
      const persona = await prisma.persona.create({
        data: {
          userId: req.user!.userId,
          genre: formData.genre,
          oneLiner: formData.oneLiner,
          creatorCallname: formData.creatorCallname,
          fanCallname: formData.fanCallname,
          tone: formData.tone,
          politenessLevel: parseInt(formData.politenessLevel),
          emojiUsage: formData.emojiUsage,
          replyLength: formData.replyLength,
          phrasingExamples: formData.phrasingExamples || '',
          bannedPhrases: formData.bannedPhrases || '',
          relationshipStyle: formData.relationshipStyle || '',
          smalltalkLevel: formData.smalltalkLevel || '',
          supportScope: formData.supportScope || '',
          refusalStyle: formData.refusalStyle || '',
          boundaries: formData.boundaries || '',
          worldKeywords: formData.worldKeywords || '',
          coreValues: formData.coreValues || '',
          consistencyRule: formData.consistencyRule || '',
          faqPairs: formData.faqPairs || '',
          ngTopicsExtra: formData.ngTopicsExtra || '',
          shareLinks: formData.shareLinks || '',
          shareInfo: formData.shareInfo || '',
          systemPrompt
        }
      });

      res.status(201).json({ persona });
    } catch (error: any) {
      console.error('Create persona error:', error);
      res.status(500).json({ error: '人格作成中にエラーが発生しました' });
    }
  }
);

/**
 * GET /api/personas/:id
 * 人格詳細取得
 */
router.get('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const personaId = String(req.params.id);

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

    res.json({ persona });
  } catch (error: any) {
    console.error('Get persona error:', error);
    res.status(500).json({ error: '人格詳細の取得中にエラーが発生しました' });
  }
});

/**
 * PUT /api/personas/:id
 * 人格更新
 */
router.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const personaId = String(req.params.id);
    const formData = req.body;

    // 所有権チェック
    const existingPersona = await prisma.persona.findFirst({
      where: {
        id: personaId,
        userId: req.user!.userId
      }
    });

    if (!existingPersona) {
      res.status(404).json({ error: '人格が見つかりません' });
      return;
    }

    // システムプロンプトを再生成
    const systemPrompt = generateSystemPrompt(formData);

    // 人格を更新
    const persona = await prisma.persona.update({
      where: { id: personaId },
      data: {
        genre: formData.genre,
        oneLiner: formData.oneLiner,
        creatorCallname: formData.creatorCallname,
        fanCallname: formData.fanCallname,
        tone: formData.tone,
        politenessLevel: parseInt(formData.politenessLevel),
        emojiUsage: formData.emojiUsage,
        replyLength: formData.replyLength,
        phrasingExamples: formData.phrasingExamples || '',
        bannedPhrases: formData.bannedPhrases || '',
        relationshipStyle: formData.relationshipStyle || '',
        smalltalkLevel: formData.smalltalkLevel || '',
        supportScope: formData.supportScope || '',
        refusalStyle: formData.refusalStyle || '',
        boundaries: formData.boundaries || '',
        worldKeywords: formData.worldKeywords || '',
        coreValues: formData.coreValues || '',
        consistencyRule: formData.consistencyRule || '',
        faqPairs: formData.faqPairs || '',
        ngTopicsExtra: formData.ngTopicsExtra || '',
        shareLinks: formData.shareLinks || '',
        shareInfo: formData.shareInfo || '',
        systemPrompt,
        lineChannelAccessToken: formData.lineChannelAccessToken || existingPersona.lineChannelAccessToken,
        lineChannelSecret: formData.lineChannelSecret || existingPersona.lineChannelSecret,
        isActive: formData.isActive !== undefined ? formData.isActive : existingPersona.isActive
      }
    });

    res.json({ persona });
  } catch (error: any) {
    console.error('Update persona error:', error);
    res.status(500).json({ error: '人格更新中にエラーが発生しました' });
  }
});

/**
 * DELETE /api/personas/:id
 * 人格削除
 */
router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const personaId = String(req.params.id);

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

    // 人格削除（関連する会話も自動削除される）
    await prisma.persona.delete({
      where: { id: personaId }
    });

    res.json({ message: '人格を削除しました' });
  } catch (error: any) {
    console.error('Delete persona error:', error);
    res.status(500).json({ error: '人格削除中にエラーが発生しました' });
  }
});

export default router;
