import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  loadAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  setAuth: (user, token) => {
    console.log('📝 authStore.setAuth called with:', { user, token: token?.substring(0, 50) + '...' });
    
    // トークンのクリーニング（改行や空白を削除）
    const cleanToken = token.trim().replace(/\s+/g, ''); // すべての空白文字を除去
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', cleanToken);
    console.log('✅ authStore.setAuth - localStorage updated');
    set({ user, token: cleanToken, isAuthenticated: true });
    console.log('✅ authStore.setAuth - state updated');
  },
  
  clearAuth: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  loadAuth: () => {
    console.log('🔄 authStore.loadAuth called');
    const userStr = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    
    // トークンのクリーニング
    if (token) {
      token = token.trim().replace(/\s+/g, ''); // すべての空白文字を除去
      
      // トークンの基本的な検証（JWTの形式チェック）
      const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
      if (!jwtPattern.test(token)) {
        console.error('❌ authStore.loadAuth - Invalid token format, clearing localStorage');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return;
      }
    }
    
    console.log('🔍 authStore.loadAuth - localStorage:', { 
      userStr: userStr?.substring(0, 100) + '...', 
      token: token?.substring(0, 50) + '...' 
    });
    
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        console.log('✅ authStore.loadAuth - Setting authenticated state');
        set({ user, token, isAuthenticated: true });
      } catch (error) {
        console.error('❌ authStore.loadAuth - Failed to parse user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      console.log('⚠️ authStore.loadAuth - No user or token in localStorage');
    }
  }
}));
