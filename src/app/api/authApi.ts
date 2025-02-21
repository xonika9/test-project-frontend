import apiClient from './apiClient';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },
};
