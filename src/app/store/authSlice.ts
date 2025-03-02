import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getAuthToken } from '@/utils/auth';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  location: string | null;
  language: string | null;
  timezone: string | null;
  themePreference: string | null;
  lastLoginAt: string | null;
  isActive: boolean;
  role: string | null;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  token: getAuthToken() || null,
  isAuthenticated: !!getAuthToken(),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
  },
});

export const { setCredentials, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
