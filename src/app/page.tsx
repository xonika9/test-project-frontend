'use client';

import { Box, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Stack direction='column' spacing={2}>
                <Button variant='contained' onClick={() => router.push('/signin')}>
                    Войти
                </Button>
                <Button variant='contained' onClick={() => router.push('/signup')}>
                    Регистрация
                </Button>
                <Button variant='contained' onClick={() => router.push('/profile')}>
                    Профиль
                </Button>
            </Stack>
        </Box>
    );
}
