'use client';

import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/theme';
import { CssBaseline } from '@mui/material';

interface MUIThemeProviderProps {
    children: React.ReactNode;
}

const MUIThemeProvider: React.FC<MUIThemeProviderProps> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default MUIThemeProvider;
