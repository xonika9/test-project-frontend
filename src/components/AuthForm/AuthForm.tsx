'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/app/store/authSlice';
import { authApi } from '@/app/api/authApi';
import { setAuthToken } from '@/utils/auth';
import { TextField, Button, Typography, Box } from '@mui/material';

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
      const response = isLogin
        ? await authApi.login({ email, password })
        : await authApi.register({ name, email, password });

      setAuthToken(response.token);
      dispatch(setCredentials({
        token: response.token,
        user: response.user
      }));
      router.push('/');
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isLogin ? 'Sign In' : 'Sign Up'}
      </Typography>
      {!isLogin && (
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
      )}
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
      >
        {isLogin ? 'Sign In' : 'Sign Up'}
      </Button>
    </Box>
  );
};

export default AuthForm;
