import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/app/store/authSlice';
import { authApi } from '@/app/api/authApi';
import { setAuthToken } from '@/utils/auth';
import { Box, Button, TextField, Typography } from '@mui/material';

interface AuthFormProps {
    isLogin?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin = true }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const loginResponse = await authApi.login({ email, password });
                setAuthToken(loginResponse.token);
                
                const profile = await authApi.getProfile();
                dispatch(
                    setCredentials({
                        token: loginResponse.token,
                        user: profile,
                    }),
                );
            } else {
                const registerResponse = await authApi.register({ name, email, password });
                setAuthToken(registerResponse.token);
                
                const profile = await authApi.getProfile();
                dispatch(
                    setCredentials({
                        token: registerResponse.token,
                        user: profile,
                    }),
                );
            }
            router.push('/');
        } catch (err) {
            setError('Authentication failed. Please check your credentials.');
        }
    };

    return (
        <Box component='form' onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant='h4' gutterBottom>
                {isLogin ? 'Sign In' : 'Sign Up'}
            </Typography>
            {!isLogin && (
                <TextField
                    label='Name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    fullWidth
                    margin='normal'
                    required
                />
            )}
            <TextField
                label='Email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin='normal'
                required
            />
            <TextField
                label='Password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin='normal'
                required
            />
            {error && (
                <Typography color='error' sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}
            <Button type='submit' variant='contained' fullWidth sx={{ mt: 3 }}>
                {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
        </Box>
    );
};

export default AuthForm;
