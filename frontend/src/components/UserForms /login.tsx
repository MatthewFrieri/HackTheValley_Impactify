import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { Input, InputLabel, Button, Box, Typography } from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios";

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);


    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error before submitting

        try {
            const response = await axios.post('https://c052-184-147-87-140.ngrok-free.app/users/login/', {
                username: username,
                password: password
            });

            if (response.status === 200) {
                // Reset the username and password fields after successful login
                setUsername('');
                setPassword('');
            }

            console.log('Login successful:', response.data);

            // You can handle further actions like redirecting the user upon success
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
                height: '100vh',
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
        </Box>
    );
}

export default Login;
