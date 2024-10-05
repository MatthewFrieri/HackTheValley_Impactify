import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { Input, InputLabel, Button, Box, Typography } from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/users/register/', {
                username,
                email,
                password
            });
            if (response.status === 201) {
                // Reset the fields after successful registration
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                // Debug message
                console.log('Login successful:', response.data);
                // Redirect to dashboard
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error('Registration error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'An error occurred during registration');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleRegister}
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
                Register New Account
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
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

            <FormControl fullWidth>
                <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleToggleConfirmPasswordVisibility}
                                edge="end"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

            {error && (
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            )}

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Register
            </Button>

            {error && (
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            )}

            <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <Button color="primary" onClick={() => navigate('/login')}>
                    Log In
                </Button>
            </Typography>
        </Box>
    );
}

export default Register;
