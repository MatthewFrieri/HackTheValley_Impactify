import api from '../../utils/api.tsx';
import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import styles from './CreateNewSession.module.css';
import { useSnackbar } from 'notistack';

interface CreateNewSessionProps {
    open: boolean
    handleClose: () => void;
    onNewSession: () => void;
}

const CreateNewSession: React.FC<CreateNewSessionProps> = ({ open, handleClose, onNewSession }) => {

    const { enqueueSnackbar } = useSnackbar();

    const [sessionName, setSessionName] = useState('');

    const handleSessionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSessionName(event.target.value);
    };

    const handleCreateSession = async () => {
        // Get the userId from localStorage
        const userId = localStorage.getItem('user_id');
        // Make sure the userId is not null
        if (!userId) {
            console.error('User ID is null');
            return;
        }
        // Make sure the session name is not empty
        if (!sessionName) {
            console.error('Session name is empty');
            return;
        }
        try {
            // Create a new session with the session name and userId
            const response = await api.post('/users/session/start/', { session_name: sessionName, user_id: userId }); 
            // Success message
            enqueueSnackbar(response.data.message, { variant: response.data.status.toLowerCase() });
            // Close the modal on successful creation
            handleClose(); 
            // Call the onNewSession callback to refresh the sessions
            onNewSession();
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
        <Modal open={open} onClose={handleClose}>
            <Box className={styles.modalBox}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Create New Session
                </Typography>
                <TextField
                    label="Session Name"
                    fullWidth
                    value={sessionName}
                    onChange={handleSessionNameChange}
                    margin="normal"
                />
                <br />
                <br />
                <Button variant="contained" color="success" onClick={handleCreateSession}>
                    Create Session
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateNewSession;