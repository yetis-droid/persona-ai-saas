import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import personaRoutes from './routes/personas';
import chatRoutes from './routes/chat';
import lineRoutes from './routes/line';
import dashboardRoutes from './routes/dashboard';
import subscriptionRoutes from './routes/subscription';
import ticketsRoutes from './routes/tickets'; // チケットシステム（リスクゼロ収益）
import adminRoutes from './routes/admin'; // 管理者専用API

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// レートリミット設定
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: 'リクエストが多すぎます。しばらくしてから再試行してください。'
});

// ミドルウェア
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://5173-iv30mcnq8rixy3ytf59wn-2e77fc33.sandbox.novita.ai',
    /\.sandbox\.novita\.ai$/
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ルーティング
app.use('/api/auth', authRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/line', lineRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/tickets', ticketsRoutes); // チケットAPI（完全前払い制）
app.use('/api/admin', adminRoutes); // 管理者専用API

// エラーハンドリング
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || '内部サーバーエラーが発生しました'
  });
});

// 404ハンドリング
app.use((req, res) => {
  res.status(404).json({ error: 'エンドポイントが見つかりません' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
