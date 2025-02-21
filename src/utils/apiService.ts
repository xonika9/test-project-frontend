import axios from 'axios';
import { UserProfile, UpdateProfileRequest } from '../types/userProfile';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:50521/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userProfileService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(profileData: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};