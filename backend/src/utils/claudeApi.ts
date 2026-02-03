// ===================================
// 🚀 完全無料LLMシステム
// Groq (メイン) + Gemini Flash (バックアップ)
// コスト: ¥0/月 (永久無料)
// ===================================

import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ===================================
// API初期化
// ===================================

// Groq (完全無料、14,400リクエスト/日)
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

// Gemini Flash (1,500リクエスト/日無料)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const gemini = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Claude (レガシー、課金あり - 非推奨)
import Anthropic from '@anthropic-ai/sdk';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
const anthropic = CLAUDE_API_KEY ? new Anthropic({ apiKey: CLAUDE_API_KEY }) : null;

// 初期化チェック
if (!groq && !gemini && !anthropic) {
  console.error('❌ LLM APIキーが1つも設定されていません！');
  console.error('   GROQ_API_KEY または GEMINI_API_KEY を設定してください');
} else {
  if (groq) console.log('✅ Groq API: 有効（完全無料）');
  if (gemini) console.log('✅ Gemini Flash API: 有効（バックアップ）');
  if (anthropic) console.log('⚠️  Claude API: 有効（課金あり・非推奨）');
}

// ===================================
// メインAPI関数（完全無料）
// ===================================

/**
 * AI返信を生成（完全無料LLM使用）
 * 
 * 優先順位:
 * 1. Groq (完全無料、14,400リクエスト/日)
 * 2. Gemini Flash (1,500リクエスト/日無料)
 * 3. Claude (課金あり - 緊急時のみ)
 */
export async function generateAIReply(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 500
): Promise<string> {
  // 優先度1: Groq (完全無料)
  if (groq) {
    try {
      console.log('🚀 Groq API使用中（完全無料）');
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile', // 最新Llama 3.3モデル
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 1
      });

      const reply = completion.choices[0]?.message?.content || '';
      if (reply) {
        console.log('✅ Groq API成功');
        return reply;
      }
    } catch (error: any) {
      console.error('⚠️ Groq API エラー:', error.message);
      
      // レート制限エラーの場合は次のAPIへ
      if (error.status === 429 || error.code === 'rate_limit_exceeded') {
        console.log('🔄 Groq制限超過 - Gemini Flashへフォールバック');
      } else {
        // それ以外のエラーは記録のみ
        console.error('Groq APIエラー詳細:', error);
      }
    }
  }

  // 優先度2: Gemini Flash (バックアップ・無料枠あり)
  if (gemini) {
    try {
      console.log('🔄 Gemini Flash使用中（バックアップ）');
      const model = gemini.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7
        }
      });

      const prompt = `${systemPrompt}\n\nUser: ${userMessage}`;
      const result = await model.generateContent(prompt);
      const reply = result.response.text();

      if (reply) {
        console.log('✅ Gemini Flash成功');
        return reply;
      }
    } catch (error: any) {
      console.error('⚠️ Gemini Flash エラー:', error.message);
      
      // 無料枠超過の場合
      if (error.status === 429) {
        console.log('🔄 Gemini無料枠超過 - Claudeへフォールバック');
      } else {
        console.error('Gemini APIエラー詳細:', error);
      }
    }
  }

  // 優先度3: Claude (課金あり - 緊急時のみ)
  if (anthropic) {
    try {
      console.warn('💰 Claude API使用中（課金あり）');
      const response = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      });

      const textContent = response.content.find(
        (block) => block.type === 'text'
      );

      if (textContent && textContent.type === 'text') {
        console.log('✅ Claude成功（課金発生）');
        return textContent.text;
      }
    } catch (error: any) {
      console.error('❌ Claude API エラー:', error.message);
      
      if (error.status === 401) {
        throw new Error('Claude API キーが無効です');
      } else if (error.status === 429) {
        throw new Error('APIレート制限に達しました');
      }
    }
  }

  // すべて失敗した場合
  throw new Error(
    '現在システムが混雑しています。しばらく経ってから再度お試しください。\n' +
    '(Groq/Gemini/Claudeすべて利用不可)'
  );
}

// ===================================
// プレミアムユーザー専用API（高品質）
// ===================================

/**
 * プレミアムユーザー向け高品質AI返信
 * (通常はGroqで十分だが、オプション機能として残す)
 */
export async function generatePremiumAIReply(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 1000
): Promise<string> {
  // プレミアムでもGroqを使用（無料・高品質）
  // 必要に応じてClaude Sonnetなどに切り替え可能
  return generateAIReply(systemPrompt, userMessage, maxTokens);
}

// ===================================
// NG話題フィルター（既存機能維持）
// ===================================

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

// ===================================
// APIヘルスチェック
// ===================================

/**
 * 利用可能なAPI一覧を取得
 */
export function getAvailableAPIs(): string[] {
  const apis: string[] = [];
  if (groq) apis.push('Groq (無料)');
  if (gemini) apis.push('Gemini Flash (無料枠)');
  if (anthropic) apis.push('Claude (課金)');
  return apis;
}

/**
 * APIステータスを取得
 */
export function getAPIStatus() {
  return {
    groq: {
      available: !!groq,
      cost: '¥0/月',
      limit: '14,400リクエスト/日'
    },
    gemini: {
      available: !!gemini,
      cost: '¥0/月（無料枠）',
      limit: '1,500リクエスト/日'
    },
    claude: {
      available: !!anthropic,
      cost: '課金あり',
      limit: '従量課金'
    }
  };
}
