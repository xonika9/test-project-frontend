'use client';

import { Box, Button, Paper, Typography } from '@mui/material';
import { LANGUAGES, THEMES } from '@/constants/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '@/app/store/authSlice';
import { RootState } from '@/app/store/store';
import { authApi } from '@/app/api/authApi';
import { getAuthToken } from '@/utils/auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ProfileView from './ProfileView';
import { UserProfile } from '@/types/userProfile';

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
            .oneOf(LANGUAGES.map(lang => lang.value))
            .nullable()
            .defined(),
        timezone: yup.string().nullable().defined(),
        themePreference: yup
            .string()
            .oneOf(THEMES.map(theme => theme.value))
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
                        Профиль
                    </Typography>
                    {!editMode && (
                        <Button variant='contained' onClick={() => setEditMode(true)}>
                            Редактировать
                        </Button>
                    )}
                </Box>

                <Box component='form' onSubmit={handleSubmit(onSubmit)}>
                    <ProfileView
                        data={data}
                        editMode={editMode}
                        control={control}
                        errors={errors}
                    />

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
