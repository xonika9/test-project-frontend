'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StoreProvider from '@/app/store/StoreProvider';
import theme from '@/app/theme';
import './globals.css';
import { Metadata } from './metadata';
import { Box, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    return (
        <html lang='en'>
            <head>
                <title>{Metadata.title}</title>
                <meta name='description' content={Metadata.description} />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <StoreProvider>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                                <Stack direction='row' spacing={2}>
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
                            {children}
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
