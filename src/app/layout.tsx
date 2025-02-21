import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import './globals.css';
import { Metadata } from './metadata';
import StoreProvider from '@/app/store/StoreProvider';
import LayoutButtons from '@/components/LayoutButtons/LayoutButtons';
import MUIThemeProvider from '@/components/MUIThemeProvider/MUIThemeProvider';

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
                        <MUIThemeProvider>
                            <LayoutButtons />
                            {children}
                        </MUIThemeProvider>
                    </AppRouterCacheProvider>
                </StoreProvider>
            </body>
        </html>
    );
}
