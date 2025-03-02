import apiClient from './apiClient';
import { UserProfile } from '@/types/userProfile';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

interface RegisterResponse {
    id: number;
    name: string;
    email: string;
}

class UpdateProfilePayload {}

export const authApi = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', payload);
        return response.data;
    },

    register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
        const response = await apiClient.post<RegisterResponse>('/auth/register', payload);
        return response.data;
    },

    getProfile: async (): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>('/users/profile');
        return response.data;
    },

    updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
        const response = await apiClient.put<UserProfile>('/users/profile', payload);
        return response.data;
    },
};
