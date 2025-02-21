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

    const {  user, isLoading, isError } = useQuery<UserProfile, Error>({ // Исправлено: data as user
        queryKey: ['profile'],
        queryFn: authApi.getProfile,
        enabled: !!token || !!getAuthToken(),
        onError: (error) => { // Опция onError принимает функцию с аргументом error
            console.error("Ошибка при загрузке профиля", error); // Добавим логирование ошибки для отладки
            router.push('/signin');
        },
    });

    if (isLoading) {
        return <Typography>Loading profile...</Typography>;
    }

    if (isError) {
        return <Typography color='error'>Error loading profile.</Typography>;
    }

    if (!user) {
        return null;
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
                <Typography variant='body1'>Name: {user?.name}</Typography>
                <Typography variant='body1'>Email: {user?.email}</Typography>
            </Paper>
        </Box>
    );
};

export default ProfilePage;
