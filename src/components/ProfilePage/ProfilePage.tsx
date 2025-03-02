'use client';

import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '@/app/store/authSlice';
import { RootState } from '@/app/store/store';
import { authApi, UserProfile } from '@/app/api/authApi';
import { getAuthToken } from '@/utils/auth';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
        language: yup
            .string()
            .oneOf(['ru', 'en'] as const)
            .nullable()
            .defined(),
        timezone: yup.string().nullable().defined(),
        themePreference: yup
            .string()
            .oneOf(['light', 'dark'] as const)
            .nullable()
            .defined(),
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
            reset({
                ...data,
                language: data.language as 'ru' | 'en' | null,
                themePreference: data.themePreference as 'light' | 'dark' | null,
            });
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

    const onSubmit = async (formData: ProfileFormValues) => {
        console.log('Отправляемые данные:', formData);
        try {
            // Преобразуем данные в формат UserProfile
            const payload: UserProfile = {
                ...data!,
                ...formData,
                language: formData.language as 'ru' | 'en' | null,
                themePreference: formData.themePreference as 'light' | 'dark' | null,
            };

            console.log('Данные после обработки:', payload);
            const result = await mutation.mutateAsync(payload);
            console.log('Ответ сервера:', result);
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            alert('Произошла ошибка при сохранении профиля. Проверьте консоль для подробностей.');
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant='h4' component='h1'>
                        Profile
                    </Typography>
                    {!editMode && (
                        <Button variant='contained' onClick={() => setEditMode(true)}>
                            Редактировать
                        </Button>
                    )}
                </Box>

                <Box
                    component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    {/* Поле имени */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant='body1' sx={{ minWidth: 120 }}>
                            Имя:
                        </Typography>
                        {editMode ? (
                            <Controller
                                name='firstName'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        size='small'
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                    />
                                )}
                            />
                        ) : (
                            <Typography>{data.firstName || 'Не указано'}</Typography>
                        )}
                    </Box>

                    {/* Поле фамилии */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant='body1' sx={{ minWidth: 120 }}>
                            Фамилия:
                        </Typography>
                        {editMode ? (
                            <Controller
                                name='lastName'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        size='small'
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                    />
                                )}
                            />
                        ) : (
                            <Typography>{data.lastName || 'Не указано'}</Typography>
                        )}
                    </Box>

                    {/* Поле email */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant='body1' sx={{ minWidth: 120 }}>
                            Email:
                        </Typography>
                        <Typography>{data.email}</Typography>
                    </Box>

                    {/* Поле логина */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant='body1' sx={{ minWidth: 120 }}>
                            Логин:
                        </Typography>
                        {editMode ? (
                            <Controller
                                name='username'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        size='small'
                                        error={!!errors.username}
                                        helperText={errors.username?.message}
                                    />
                                )}
                            />
                        ) : (
                            <Typography>{data.username || 'Не указано'}</Typography>
                        )}
                    </Box>

                    {/* Поле телефона */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant='body1' sx={{ minWidth: 120 }}>
                            Телефон:
                        </Typography>
                        {editMode ? (
                            <Controller
                                name='phoneNumber'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        size='small'
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber?.message}
                                    />
                                )}
                            />
                        ) : (
                            <Typography>{data.phoneNumber || 'Не указано'}</Typography>
                        )}
                    </Box>

                    {/* Поле местоположения */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant='body1' sx={{ minWidth: 120 }}>
                            Местоположение:
                        </Typography>
                        {editMode ? (
                            <Controller
                                name='location'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        size='small'
                                        error={!!errors.location}
                                        helperText={errors.location?.message}
                                    />
                                )}
                            />
                        ) : (
                            <Typography>{data.location || 'Не указано'}</Typography>
                        )}
                    </Box>

                    {/* Поле языка */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant='body1' sx={{ minWidth: 120 }}>
                            Язык:
                        </Typography>
                        {editMode ? (
                            <Controller
                                name='language'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        size='small'
                                        error={!!errors.language}
                                        helperText={errors.language?.message}
                                    >
                                        <MenuItem value='ru'>Русский</MenuItem>
                                        <MenuItem value='en'>English</MenuItem>
                                    </TextField>
                                )}
                            />
                        ) : (
                            <Typography>
                                {data.language === 'ru' ? 'Русский' : 'English'}
                            </Typography>
                        )}
                    </Box>

                    {/* Поле темы */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant='body1' sx={{ minWidth: 120 }}>
                            Тема:
                        </Typography>
                        {editMode ? (
                            <Controller
                                name='themePreference'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        size='small'
                                        error={!!errors.themePreference}
                                        helperText={errors.themePreference?.message}
                                    >
                                        <MenuItem value='light'>Светлая</MenuItem>
                                        <MenuItem value='dark'>Темная</MenuItem>
                                    </TextField>
                                )}
                            />
                        ) : (
                            <Typography>
                                {data.themePreference === 'light' ? 'Светлая' : 'Темная'}
                            </Typography>
                        )}
                    </Box>

                    {/* Поле биографии */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Typography variant='body1' sx={{ minWidth: 120, pt: 1 }}>
                            Биография:
                        </Typography>
                        {editMode ? (
                            <Controller
                                name='bio'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size='small'
                                        error={!!errors.bio}
                                        helperText={errors.bio?.message}
                                    />
                                )}
                            />
                        ) : (
                            <Typography>{data.bio || 'Не указано'}</Typography>
                        )}
                    </Box>

                    {/* Поле аватара */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant='body1' sx={{ minWidth: 120 }}>
                            Аватар:
                        </Typography>
                        {editMode ? (
                            <Controller
                                name='avatarUrl'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        size='small'
                                        error={!!errors.avatarUrl}
                                        helperText={errors.avatarUrl?.message}
                                    />
                                )}
                            />
                        ) : data.avatarUrl ? (
                            <img
                                src={data.avatarUrl}
                                alt='Аватар'
                                style={{ width: 100, height: 100, borderRadius: '50%' }}
                            />
                        ) : (
                            <Typography>Не указано</Typography>
                        )}
                    </Box>

                    {/* Дополнительная информация */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                        <Typography variant='body2'>
                            Дата регистрации: {new Date(data.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant='body2'>
                            Последнее обновление: {new Date(data.updatedAt).toLocaleString()}
                        </Typography>
                        <Typography variant='body2'>
                            Последний вход: {new Date(data.lastLoginAt || '').toLocaleString()}
                        </Typography>
                    </Box>

                    {editMode && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button
                                type='submit'
                                variant='contained'
                                color='primary'
                                disabled={mutation.isPending}
                                sx={{ minWidth: 200 }}
                            >
                                {mutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
                            </Button>
                            <Button
                                variant='outlined'
                                color='error'
                                onClick={() => setEditMode(false)}
                                sx={{ minWidth: 200 }}
                            >
                                Отмена
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default ProfilePage;
