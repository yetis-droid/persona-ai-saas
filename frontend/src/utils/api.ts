import axios from 'axios';

// サンドボックス環境ではproxyを使用するため、空文字列に設定
const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // クッキーを送信
  headers: {
    'Content-Type': 'application/json'
  }
});

// リクエストインターセプター（トークンを追加）
api.interceptors.request.use(
  (config) => {
    // ローカルストレージからトークンを取得
    let token = localStorage.getItem('token');
    
    // トークンのクリーニング（改行や空白を削除）
    if (token) {
      token = token.trim().replace(/\s+/g, ''); // すべての空白文字を削除
      
      // トークンの基本的な検証（JWTの形式チェック）
      const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
      if (!jwtPattern.test(token)) {
        console.error('❌ Invalid token format, clearing localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        token = null;
      }
    }
    
    console.log('📡 API Request:', {
      method: config.method,
      url: config.url,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 30) + '...' : 'none'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（エラーハンドリング）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('🚨 API Error Interceptor:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method
    });
    
    if (error.response?.status === 401) {
      console.log('❌ 401 Unauthorized - Clearing localStorage and redirecting to /login');
      // 認証エラーの場合、トークンをクリアしてログインページへ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
