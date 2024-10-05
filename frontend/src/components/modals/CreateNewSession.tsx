import api from '../../utils/api';
import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import styles from './CreateNewSession.module.css';

interface CreateNewSessionProps {
    open: boolean
    handleClose: () => void;
}

const CreateNewSession: React.FC<CreateNewSessionProps> = ({ open, handleClose }) => {

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
            await api.post('/users/session/start/', { session_name: sessionName, userId }); 
            // Close the modal on successful creation
            handleClose(); 
        } catch (error) {
            // TODO: Show an error message to the user
            console.error('Error creating session:', error);
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
                <Button variant="contained" color="primary" onClick={handleCreateSession}>
                    Create Session
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateNewSession;