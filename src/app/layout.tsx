import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import './globals.css';
import { Metadata } from './metadata';
import StoreProvider from '@/app/store/StoreProvider';
import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import MUIThemeProvider from '@/components/MUIThemeProvider/MUIThemeProvider';
import { QueryClient, QueryClientProvider } from 'react-query'; // Импортируем QueryClient и QueryClientProvider

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const queryClient = new QueryClient(); // Создаем экземпляр QueryClient

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
                <QueryClientProvider client={queryClient}> {/* Оборачиваем QueryClientProvider */}
                    <StoreProvider>
                        <AppRouterCacheProvider>
                            <MUIThemeProvider>
                                <LayoutButtons />
                                {children}
                            </MUIThemeProvider>
                        </AppRouterCacheProvider>
                    </StoreProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}
