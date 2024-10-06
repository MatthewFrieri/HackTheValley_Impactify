import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { Input, InputLabel, Button, Box, Typography } from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
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
                localStorage.setItem('user_id', response.data.user_id);
                localStorage.setItem('user_type', response.data.user_type);
                localStorage.setItem('username', username);
                // Reset the fields after successful login
                setUsername('');
                setPassword('');
                // Debug message
                console.log('Login successful:', response.data);
                // Redirect to dashboard
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'An error occurred during login');
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
                color="primary"
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
                <Button color="primary" onClick={() => navigate('/register')}>
                    Register
                </Button>
            </Typography>            
        </Box>
    );
};

export default Login;
