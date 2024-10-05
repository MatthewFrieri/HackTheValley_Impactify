import api from '../../utils/api';
import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const CreateNewSession: React.FC = () => {

    const [open, setOpen] = useState(false);
    const [sessionName, setSessionName] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSessionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSessionName(event.target.value);
    };

    const handleCreateSession = async () => {
        try {
            const response = await api.post('/users/sessions', { name: sessionName }); 
            // Close the modal on successful creation
            handleClose(); 
        } catch (error) {
            // TODO: Show an error message to the user
            console.error('Error creating session:', error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
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
                <Button variant="contained" color="primary" onClick={handleCreateSession}>
                    Create Session
                </Button>
            </Box>
        </Modal>
    );
};

export default CreateNewSession;