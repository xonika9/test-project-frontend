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

interface LoginResponse {
    token: string;
}

interface RegisterResponse {
    id: number;
    name: string;
    email: string;
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

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
    }
};
