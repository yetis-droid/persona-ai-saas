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
import Debug from './pages/Debug';
import AuthTest from './pages/AuthTest';
import QuickLogin from './pages/QuickLogin';

// 認証必須ルート
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loadAuth } = useAuthStore();
  const [isChecking, setIsChecking] = React.useState(true);
  
  React.useEffect(() => {
    // 認証情報を読み込む
    loadAuth();
    
    // 少し待ってからチェック完了
    setTimeout(() => {
      setIsChecking(false);
    }, 100);
  }, []);
  
  // チェック中はローディング表示
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証確認中...</p>
        </div>
      </div>
    );
  }
  
  // localStorageに直接トークンがあるかチェック
  const token = localStorage.getItem('token');
  
  console.log('🔐 PrivateRoute check:', {
    isAuthenticated,
    hasToken: !!token,
    token: token?.substring(0, 50)
  });
  
  // トークンがない場合はログインへ
  if (!token) {
    console.log('❌ No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // トークンがあれば子要素をレンダリング
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
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/auth-test" element={<AuthTest />} />
        <Route path="/quick-login" element={<QuickLogin />} />
        
        {/* 認証必須ルート */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
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
        
        {/* デフォルトリダイレクト */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
