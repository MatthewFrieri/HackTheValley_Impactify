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
        try {
            const response = await api.post('/users/sessions/start', { session_name: sessionName }); 
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