'use client';

import { Box, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query'; // Импортируем useQuery из @tanstack/react-query
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
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

    const { data, isLoading, isError } = useQuery<UserProfile, Error>({
        queryKey: ['profile'],
        queryFn: authApi.getProfile,
        enabled: !!token || !!getAuthToken(),
        staleTime: 300000,
    });

    if (isLoading) {
        return <Typography>Loading profile...</Typography>;
    }

    if (isError) {
        return <Typography color='error'>Error loading profile.</Typography>;
    }

    if (!data) {
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
                <Typography variant='body1'>Name: {data?.name}</Typography>
                <Typography variant='body1'>Email: {data?.email}</Typography>
            </Paper>
        </Box>
    );
};

export default ProfilePage;
