'use client';

import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useRouter } from 'next/navigation';

interface User {
    name: string;
    email: string;
    // Add other user properties as needed
}

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                router.push('/signin');
                return;
            }

            // Replace this with your actual API call to fetch user data
            try {
                const response = await fetch('/api/users/profile', {
                    // Replace '/api/profile' with your actual endpoint
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setUser(data); // Assuming the API returns user data in the correct format
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Handle error appropriately (e.g., display an error message)
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
                {/* Display other user information here */}
            </Paper>
        </Box>
    );
};

export default ProfilePage;
