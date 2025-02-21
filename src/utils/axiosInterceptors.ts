import { AxiosInstance } from 'axios';
import { makeStore } from '@/app/store/store';
import { logout } from '@/app/store/authSlice';

export const setupInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');
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
                makeStore.dispatch(logout());
                window.location.href = '/signin';
            }
            return Promise.reject(error);
        },
    );
};
