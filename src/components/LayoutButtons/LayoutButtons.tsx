'use client';

import { Box, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/app/store/authSlice';
import { removeAuthToken } from '@/utils/auth';
import { RootState } from '@/app/store/store';

const LayoutButtons = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        removeAuthToken();
        router.push('/signin');
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Stack direction='row' spacing={2}>
                {isAuthenticated ? (
                    <Button variant='contained' onClick={handleLogout}>
                        Выйти
                    </Button>
                ) : (
                    <>
                        <Button variant='contained' onClick={() => router.push('/signin')}>
                            Войти
                        </Button>
                        <Button variant='contained' onClick={() => router.push('/signup')}>
                            Регистрация
                        </Button>
                    </>
                )}
                <Button variant='contained' onClick={() => router.push('/profile')}>
                    Профиль
                </Button>
            </Stack>
        </Box>
    );
};

export default LayoutButtons;
