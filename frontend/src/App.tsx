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

// 認証必須ルート
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
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
