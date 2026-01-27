import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';

if (!CLAUDE_API_KEY) {
  console.warn('⚠️  CLAUDE_API_KEY is not set. AI features will not work.');
}

const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
});

/**
 * Claude APIを使用してAI返信を生成
 */
export async function generateAIReply(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 1000
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    // テキストコンテンツを抽出
    const textContent = response.content.find(
      (block) => block.type === 'text'
    );

    if (!textContent || textContent.type !== 'text') {
      throw new Error('AIからのテキスト応答が見つかりません');
    }

    return textContent.text;
  } catch (error: any) {
    console.error('Claude API error:', error);
    
    // エラーメッセージを詳細に
    if (error.status === 401) {
      throw new Error('Claude API キーが無効です');
    } else if (error.status === 429) {
      throw new Error('APIレート制限に達しました。しばらくしてから再試行してください');
    } else if (error.status === 500) {
      throw new Error('Claude APIでエラーが発生しました');
    }
    
    throw new Error(`AI応答生成エラー: ${error.message}`);
  }
}

/**
 * 固定NG話題リスト
 */
export const FIXED_NG_TOPICS = [
  '恋愛',
  '政治',
  '宗教',
  '医療',
  '法律',
  '投資',
  '批判',
  '個人情報',
  '恋人',
  'デート',
  '付き合',
  '好き',
  '愛してる',
  '選挙',
  '政党',
  '政権',
  '信仰',
  '神',
  '仏',
  '病気',
  '診断',
  '治療',
  '薬',
  '訴訟',
  '契約',
  '株',
  'FX',
  '仮想通貨',
  'ビットコイン'
];

/**
 * メッセージにNG話題が含まれているかチェック
 */
export function containsNGTopic(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  return FIXED_NG_TOPICS.some(ngTopic => {
    return lowerMessage.includes(ngTopic.toLowerCase());
  });
}

/**
 * 安全な断り文
 */
export const SAFE_REFUSAL_MESSAGE = 
  'その質問にはお答えできません。もし詳しく知りたい場合は、本人に直接お問い合わせください。';
