'use client';

import { Box, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query'; // Импортируем useQuery из @tanstack/react-query
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/api/authApi';
import { getAuthToken } from '@/utils/auth';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

const ProfilePage = () => {
    const token = useSelector((state: RootState) => state.auth.token);
    const router = useRouter();

    const {  user, isLoading, isError } = useQuery<UserProfile, Error>({ // Используем useQuery
        queryKey: ['profile'], // Ключ запроса
        queryFn: authApi.getProfile, // Функция запроса
        enabled: !!token || !!getAuthToken(), // Запрос выполняется только если есть токен
        onError: () => {
            router.push('/signin'); // Редирект на страницу входа при ошибке
        },
    });

    if (isLoading) {
        return <Typography>Loading profile...</Typography>;
    }

    if (isError) {
        return <Typography color="error">Error loading profile.</Typography>;
    }

    if (!user) {
        return null; // Или другой fallback, если данные не загрузились по какой-то причине, кроме ошибки (например, из-за disabled: false)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 400 }}>
                <Typography variant='h4' component='h1' gutterBottom>
                    Profile
                </Typography>
                <Typography variant='body1'>Name: {user.name}</Typography>
                <Typography variant='body1'>Email: {user.email}</Typography>
            </Paper>
        </Box>
    );
};

export default ProfilePage;
