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
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    console.log('✅ authStore.setAuth - localStorage updated');
    set({ user, token, isAuthenticated: true });
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
    const token = localStorage.getItem('token');
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
