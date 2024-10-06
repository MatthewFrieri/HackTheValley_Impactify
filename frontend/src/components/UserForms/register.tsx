import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { Input, InputLabel, Button, Box, Typography, Select, MenuItem } from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../../utils/api'
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Register: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userType, setUserType] = useState('player');

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cleanedNumber = event.target.value.replace(/\D/g, '');
        const formattedNumber = cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        setPhoneNumber(formattedNumber);
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
                password,
                user_type: userType,
                phone_number: phoneNumber,
            });
            if (response.status === 201) {
                // Reset the fields after successful registration
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                // Debug message
                enqueueSnackbar(response.data.message, { variant: response.data.status.toLowerCase() });
                // Override local storage
                localStorage.removeItem('user_id');
                localStorage.removeItem('username');
                localStorage.removeItem('user_type');
                // Redirect to login page
                navigate('/login');
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
              <InputLabel htmlFor="phoneNum">Phone Number</InputLabel>
              <Input
                id="phoneNum"
                value={phoneNumber}
                onChange={handlePhoneNumberChange} 
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

            <FormControl fullWidth>
                <InputLabel htmlFor="user-type" >I am signing up as a:</InputLabel>
                <Select
                    label={'I am signing up as a:'}
                    id="user-type"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    sx={{ height: 40 }}
                >
                    <MenuItem value="player">Player</MenuItem>
                    <MenuItem value="coach">Coach</MenuItem>
                </Select>
            </FormControl>

            {error && (
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            )}

            <Button
                type="submit"
                variant="contained"
                color="success"
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
                <Button color="success" onClick={() => navigate('/login')}>
                    Log In
                </Button>
            </Typography>
        </Box>
    );
}

export default Register;
