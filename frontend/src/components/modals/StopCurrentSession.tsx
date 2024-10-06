import api from '../../utils/api';
import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import styles from './StopCurrentSession.module.css';
import { useSnackbar } from 'notistack';

interface StopCurrentSessionProps {
    open: boolean
    handleClose: () => void;
    onStopSession: () => void;
}

const StopCurrentSession: React.FC<StopCurrentSessionProps> = ({ open, handleClose, onStopSession }) => {

    const { enqueueSnackbar } = useSnackbar();

    const handleStopSession = async () => {
        try {
            const response = await api.post('/users/session/end/', { user_id: localStorage.getItem('user_id') });
            // Success message
            enqueueSnackbar(response.data.message, { variant: response.data.status.toLowerCase() });
            // Close the modal on successful creation
            handleClose();
            // Call the onStopSession callback to refresh the sessions
            onStopSession();
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