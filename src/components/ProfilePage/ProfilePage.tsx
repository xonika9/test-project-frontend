'use client';

import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '@/app/store/authSlice';
import { RootState } from '@/app/store/store';
import { authApi } from '@/app/api/authApi';
import { getAuthToken } from '@/utils/auth';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
    // Схема валидации
    const profileSchema = yup.object({
        firstName: yup.string().nullable().defined(),
        lastName: yup.string().nullable().defined(),
        username: yup.string().nullable().defined(),
        bio: yup.string().nullable().defined(),
        avatarUrl: yup.string().url('Некорректный URL').nullable().defined(),
        phoneNumber: yup
            .string()
            .matches(/^\+?[0-9]{10,15}$/, 'Некорректный номер телефона')
            .nullable()
            .defined(),
        location: yup.string().nullable().defined(),
        language: yup.string().oneOf(['ru', 'en'] as const).nullable().defined(),
        timezone: yup.string().nullable().defined(),
        themePreference: yup.string().oneOf(['light', 'dark'] as const).nullable().defined(),
    });

    const [editMode, setEditMode] = useState(false);
    const queryClient = useQueryClient();
    const token = useSelector((state: RootState) => state.auth.token);

    const { data, isLoading, isError } = useQuery<UserProfile, Error>({
        queryKey: ['profile'],
        queryFn: authApi.getProfile,
        enabled: !!token || !!getAuthToken(),
        staleTime: 300000,
    });

    type ProfileFormValues = yup.InferType<typeof profileSchema>;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            firstName: null,
            lastName: null,
            username: null,
            bio: null,
            avatarUrl: null,
            phoneNumber: null,
            location: null,
            language: 'ru',
            timezone: 'Europe/Moscow',
            themePreference: 'light',
        },
    });

    const dispatch = useDispatch();

    const mutation = useMutation({
        mutationFn: (data: ProfileFormValues) => authApi.updateProfile(data),
        onSuccess: updatedProfile => {
            // Обновляем профиль в Redux store
            dispatch(updateProfile(updatedProfile));
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            setEditMode(false);
        },
        onError: error => {
            console.error('Profile update failed:', error);
            // Можно добавить уведомление об ошибке
            alert('Не удалось обновить профиль. Пожалуйста, попробуйте снова.');
        },
    });

    // Сбрасываем форму при изменении данных
    useEffect(() => {
        if (data) {
            reset(data);
        }
    }, [data, reset]);

    if (isLoading) {
        return <Typography>Loading profile...</Typography>;
    }

    if (isError) {
        return <Typography color='error'>Error loading profile.</Typography>;
    }

    if (!data) {
        return null;
    }

    const onSubmit = (data: ProfileFormValues) => {
        mutation.mutate(data);
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
                            Name: {data?.firstName && `${data.firstName} ${data.lastName}`}
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
                    <Box
                        component='form'
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <Controller
                                name='firstName'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label='Имя'
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                    />
                                )}
                            />
                            <Controller
                                name='lastName'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label='Фамилия'
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                    />
                                )}
                            />
                            <Controller
                                name='username'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label='Логин'
                                        error={!!errors.username}
                                        helperText={errors.username?.message}
                                    />
                                )}
                            />
                            <Controller
                                name='phoneNumber'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label='Телефон'
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber?.message}
                                    />
                                )}
                            />
                            <Controller
                                name='location'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label='Местоположение'
                                        error={!!errors.location}
                                        helperText={errors.location?.message}
                                    />
                                )}
                            />
                            <Controller
                                name='language'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label='Язык'
                                        error={!!errors.language}
                                        helperText={errors.language?.message}
                                    >
                                        <MenuItem value='ru'>Русский</MenuItem>
                                        <MenuItem value='en'>English</MenuItem>
                                    </TextField>
                                )}
                            />
                            <Controller
                                name='themePreference'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label='Тема'
                                        error={!!errors.themePreference}
                                        helperText={errors.themePreference?.message}
                                    >
                                        <MenuItem value='light'>Светлая</MenuItem>
                                        <MenuItem value='dark'>Темная</MenuItem>
                                    </TextField>
                                )}
                            />
                        </Box>
                        <Controller
                            name='bio'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='Биография'
                                    multiline
                                    rows={3}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    error={!!errors.bio}
                                    helperText={errors.bio?.message}
                                />
                            )}
                        />
                        <Controller
                            name='avatarUrl'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='URL аватара'
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    error={!!errors.avatarUrl}
                                    helperText={errors.avatarUrl?.message}
                                />
                            )}
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'
                            sx={{ mt: 2 }}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ProfilePage;
