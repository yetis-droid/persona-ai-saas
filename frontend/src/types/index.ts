// User型
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt?: string;
  plan?: 'free' | 'premium';
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

// 使用状況型
export interface UsageStats {
  todayCount: number;
  limit: number; // dailyLimit から limit に変更
  planName: string; // plan から planName に変更
  resetTime: string; // リセット時刻を追加
}

// Persona型
export interface Persona {
  id: string;
  userId: string;
  genre: string;
  oneLiner: string;
  creatorCallname: string;
  fanCallname: string;
  tone: string;
  politenessLevel: number;
  emojiUsage: string;
  replyLength: string;
  phrasingExamples: string;
  bannedPhrases: string;
  relationshipStyle: string;
  smalltalkLevel: string;
  supportScope: string;
  refusalStyle: string;
  boundaries: string;
  worldKeywords: string;
  coreValues: string;
  consistencyRule: string;
  faqPairs: string;
  ngTopicsExtra: string;
  shareLinks: string;
  shareInfo: string;
  systemPrompt: string;
  lineChannelAccessToken: string | null;
  lineChannelSecret: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Conversation型
export interface Conversation {
  id: string;
  personaId: string;
  source: 'web' | 'line';
  fanLineId: string | null;
  userMessage: string;
  aiReply: string;
  rating: number | null;
  isNgDetected: boolean;
  createdAt: string;
}

// PersonaFormData型
export interface PersonaFormData {
  genre: string;
  oneLiner: string;
  creatorCallname: string;
  fanCallname: string;
  tone: string;
  politenessLevel: number;
  emojiUsage: string;
  replyLength: string;
  phrasingExamples: string;
  bannedPhrases: string;
  relationshipStyle: string;
  smalltalkLevel: string;
  supportScope: string;
  refusalStyle: string;
  boundaries: string;
  worldKeywords: string;
  coreValues: string;
  consistencyRule: string;
  faqPairs: string;
  ngTopicsExtra: string;
  shareLinks: string;
  shareInfo: string;
}

// Dashboard統計型
export interface DashboardStats {
  personaId: string;
  totalConversations: number;
  webConversations: number;
  lineConversations: number;
  ngDetectedCount: number;
  averageRating: number;
  ratingDistribution: Array<{ rating: number; count: number }>;
  dailyConversations: Array<{ date: string; count: number }>;
}
