import api from '../../utils/api';
import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import styles from './StopCurrentSession.module.css';

interface StopCurrentSessionProps {
    open: boolean
    handleClose: () => void;
    onStopSession: () => void;
}

const StopCurrentSession: React.FC<StopCurrentSessionProps> = ({ open, handleClose, onStopSession }) => {

    const handleStopSession = async () => {
        try {
            await api.post('/users/session/end/', { user_id: localStorage.getItem('user_id') }); 
            // Close the modal on successful creation
            handleClose();
            // Call the onStopSession callback to refresh the sessions
            onStopSession();
        } catch (error) {
            // TODO: Show an error message to the user
            console.error('Error stopping session:', error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className={styles.modalBox}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Stop Your Current Session
                </Typography>
                <Typography variant="h6" component="p" gutterBottom>
                    Stopping your current session will end the tracking of metrics from the helmet.
                    The session data can then be viewed in the Metrics dashboard. 
                </Typography>
                <Button variant="contained" color="error" onClick={handleStopSession}>
                    Stop Session
                </Button>
            </Box>
        </Modal>
    );
};

export default StopCurrentSession;