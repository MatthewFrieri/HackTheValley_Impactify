import React, { useState } from 'react';
import { FormControl } from '@mui/material';
import { Input, InputLabel, Button, Box, Typography } from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.tsx';
import { useSnackbar } from 'notistack';

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error before submitting
        try {
            const response = await api.post('/users/login/', {
                username: username,
                password: password
            });
            if (response.status === 200) {
                // Store user variables in localStorage
                localStorage.setItem('user_id', response.data.data.user_id);
                localStorage.setItem('user_type', response.data.data.user_type);
                localStorage.setItem('username', username);
                // Reset the fields after successful login
                setUsername('');
                setPassword('');
                // Debug message
                enqueueSnackbar(response.data.message, { variant: response.data.status.toLowerCase() });
                // Redirect to dashboard
                navigate('/dashboard');
            }
        } catch (error: any) {
            if (error.response) {
                // Server responded with a status other than 200 range
                enqueueSnackbar(error.response.data.message, { variant: error.response.data.status.toLowerCase() });
            } else if (error.request) {
                // Request was made but no response received
                enqueueSnackbar('No response from server. Please try again later.', { variant: 'error' });
            } else {
                // Something else happened while setting up the request
                enqueueSnackbar('An unexpected error occurred. Please try again.', { variant: 'error' });
            }
            console.error('Error stopping session:', error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                padding: 3,
                maxWidth: 400,
                margin: '0 auto',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <FormControl fullWidth>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FormControl>

            <FormControl fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

            <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
            >
                Login
            </Button>

            {error && (
                <Typography color="error" variant="body1">
                    {error}
                </Typography>
            )}

            <Typography variant="body2" sx={{ mt: 2 }}>
                Don't have an account?{' '}
                <Button color="success" onClick={() => navigate('/register')}>
                    Register
                </Button>
            </Typography>            
        </Box>
    );
};

export default Login;
