'use client';

import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query'; // Импортируем useQuery из @tanstack/react-query
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { authApi } from '@/app/api/authApi';
import { getAuthToken } from '@/utils/auth';
import { useState } from 'react';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    bio: string | null;
    avatarUrl: string | null;
    phoneNumber: string | null;
    location: string | null;
    language: string | null;
    timezone: string | null;
    themePreference: string | null;
    lastLoginAt: string | null;
    isActive: boolean;
    role: string | null;
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

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        username: data?.username || '',
        bio: data?.bio || '',
        avatarUrl: data?.avatarUrl || '',
        phoneNumber: data?.phoneNumber || '',
        location: data?.location || '',
        language: data?.language || 'ru',
        timezone: data?.timezone || 'Europe/Moscow',
        themePreference: data?.themePreference || 'light',
    });

    const handleUpdateProfile = async () => {
        try {
            await authApi.updateProfile(formData);
            setEditMode(false);
            // TODO: Add logic to refresh profile data
        } catch (error) {
            console.error('Profile update failed:', error);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant='h4' component='h1'>
                        Profile
                    </Typography>
                    <Button variant='contained' onClick={() => setEditMode(!editMode)}>
                        {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                </Box>

                {!editMode ? (
                    <>
                        <Typography variant='body1' sx={{ mb: 1 }}>
                            Name: {data?.name}{' '}
                            {data?.firstName && `(${data.firstName} ${data.lastName})`}
                        </Typography>
                        <Typography variant='body1' sx={{ mb: 1 }}>
                            Email: {data?.email}
                        </Typography>
                        {data?.bio && (
                            <Typography variant='body1' sx={{ mb: 1 }}>
                                Bio: {data.bio}
                            </Typography>
                        )}
                        {data?.location && (
                            <Typography variant='body1' sx={{ mb: 1 }}>
                                Location: {data.location}
                            </Typography>
                        )}
                        {data?.phoneNumber && (
                            <Typography variant='body1' sx={{ mb: 1 }}>
                                Phone: {data.phoneNumber}
                            </Typography>
                        )}
                        <Typography variant='caption'>
                            Last login: {new Date(data?.lastLoginAt || '').toLocaleString()}
                        </Typography>
                    </>
                ) : (
                    <Box component='form' sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <TextField
                                label='Имя'
                                value={formData.firstName}
                                onChange={e =>
                                    setFormData({ ...formData, firstName: e.target.value })
                                }
                            />
                            <TextField
                                label='Фамилия'
                                value={formData.lastName}
                                onChange={e =>
                                    setFormData({ ...formData, lastName: e.target.value })
                                }
                            />
                            <TextField
                                label='Логин'
                                value={formData.username}
                                onChange={e =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                            />
                            <TextField
                                label='Телефон'
                                value={formData.phoneNumber}
                                onChange={e =>
                                    setFormData({ ...formData, phoneNumber: e.target.value })
                                }
                            />
                            <TextField
                                label='Местоположение'
                                value={formData.location}
                                onChange={e =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                            />
                            <TextField
                                label='Язык'
                                select
                                value={formData.language}
                                onChange={e =>
                                    setFormData({ ...formData, language: e.target.value })
                                }
                            >
                                <MenuItem value='ru'>Русский</MenuItem>
                                <MenuItem value='en'>English</MenuItem>
                            </TextField>
                            <TextField
                                label='Тема'
                                select
                                value={formData.themePreference}
                                onChange={e =>
                                    setFormData({ ...formData, themePreference: e.target.value })
                                }
                            >
                                <MenuItem value='light'>Светлая</MenuItem>
                                <MenuItem value='dark'>Темная</MenuItem>
                            </TextField>
                        </Box>
                        <TextField
                            label='Биография'
                            multiline
                            rows={3}
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            label='URL аватара'
                            value={formData.avatarUrl}
                            onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleUpdateProfile}
                            sx={{ mt: 2 }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ProfilePage;
