import { AxiosInstance } from 'axios';
import { store } from '@/app/store/store';
import { logout } from '@/app/store/authSlice';
import { getAuthToken } from '@/utils/auth';

export const setupInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        config => {
            const token = store.getState().auth.token || getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => Promise.reject(error),
    );

    instance.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401) {
                store.dispatch(logout());
                window.location.href = '/signin';
            }
            return Promise.reject(error);
        },
    );
};
