'use client';

import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/api/authApi';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

const ProfilePage = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                router.push('/signin');
                return;
            }

            try {
                const profile = await authApi.getProfile();
                setUser(profile);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [token, router]);

    if (!user) {
        return <Typography>Loading profile...</Typography>;
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
