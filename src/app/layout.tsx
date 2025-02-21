import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/app/theme';
import './globals.css';
import { Metadata } from './metadata';
import StoreProvider from '@/app/store/StoreProvider';
import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';

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
                            <LayoutButtons />
                            {children}
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
