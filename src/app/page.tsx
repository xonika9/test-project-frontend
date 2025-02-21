import { Box, Paper, Typography } from '@mui/material';

export default function Home() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 400 }}>
                <Typography variant='h4' component='h1' gutterBottom>
                    Главная
                </Typography>
            </Paper>
        </Box>
    );
}
