import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PersonaForm from './pages/PersonaForm';
import Chat from './pages/Chat';
import Conversations from './pages/Conversations';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import Pricing from './pages/Pricing';
import Tickets from './pages/Tickets'; // チケット購入ページ
import PrivacyPolicy from './pages/PrivacyPolicy'; // プライバシーポリシー
import Admin from './pages/Admin'; // 管理者ダッシュボード
import AdminSecurity from './pages/AdminSecurity'; // セキュリティ管理
import Landing from './pages/Landing'; // ランディングページ
import Debug from './pages/Debug';
import AuthTest from './pages/AuthTest';
import QuickLogin from './pages/QuickLogin';
import LoginDebug from './pages/LoginDebug';
import StorageTest from './pages/StorageTest';

// 認証必須ルート
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loadAuth } = useAuthStore();
  const [isReady, setIsReady] = React.useState(false);
  
  React.useEffect(() => {
    console.log('🔐 PrivateRoute: Checking authentication...');
    
    // localStorageから直接チェック
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🔍 PrivateRoute: localStorage check', {
      hasToken: !!token,
      hasUser: !!user,
      isAuthenticated
    });
    
    // トークンがあればloadAuthを呼ぶ
    if (token && user && !isAuthenticated) {
      console.log('📝 PrivateRoute: Loading auth from localStorage...');
      loadAuth();
    }
    
    setIsReady(true);
  }, []);
  
  // 準備完了まで待つ
  if (!isReady) {
    return null;
  }
  
  // localStorageに直接トークンがあるかチェック
  const token = localStorage.getItem('token');
  
  console.log('🔐 PrivateRoute: Final check', {
    hasToken: !!token,
    isAuthenticated,
    willRedirect: !token
  });
  
  // トークンがない場合はログインへ
  if (!token) {
    console.log('❌ PrivateRoute: No token, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  // トークンがあれば子要素をレンダリング
  console.log('✅ PrivateRoute: Token found, rendering children');
  return <>{children}</>;
};

function App() {
  const { loadAuth } = useAuthStore();

  useEffect(() => {
    // アプリ起動時に認証情報を読み込む
    loadAuth();
  }, [loadAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* 公開ルート */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/auth-test" element={<AuthTest />} />
        <Route path="/quick-login" element={<QuickLogin />} />
        <Route path="/login-debug" element={<LoginDebug />} />
        <Route path="/storage-test" element={<StorageTest />} />
        
        {/* 認証必須ルート */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="/admin/security" element={
          <PrivateRoute>
            <AdminSecurity />
          </PrivateRoute>
        } />
        <Route path="/tickets" element={
          <PrivateRoute>
            <Tickets />
          </PrivateRoute>
        } />
        <Route path="/personas/new" element={
          <PrivateRoute>
            <PersonaForm />
          </PrivateRoute>
        } />
        <Route path="/personas/:id/chat" element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        } />
        <Route path="/personas/:id/conversations" element={
          <PrivateRoute>
            <Conversations />
          </PrivateRoute>
        } />
        <Route path="/personas/:id/settings" element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } />
        
        {/* デフォルトルート: ランディングページ */}
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
