import api from '../../utils/api';
import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import styles from './AddPlayerModal.module.css';
import { useSnackbar } from 'notistack';

interface AddPlayerModalProps {
    open: boolean
    handleClose: () => void;
    onAddPlayer: () => void;
}

interface Player {
    id: string;
    username: string;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ open, handleClose, onAddPlayer }) => {

    const { enqueueSnackbar } = useSnackbar();

    // Get the userId from localStorage
    const userId = localStorage.getItem('user_id');

    const [loading, setLoading] = useState<boolean>(true);
    const [players, setPlayers] = useState<Player[]>([]);
    const [player, setPlayer] = useState('');

    const getPlayers = async () => {
        setLoading(true);
        // Get all the players
        const response = await api.get('/users/players/all/', { params: { user_id: userId } });
        // Set the state to the players
        setPlayers(response.data.data || []);
        setLoading(false);
    };

    const handleAddPlayer = async () => {
        // Make sure the userId is not null
        if (!userId) {
            console.error('User ID is null');
            return;
        }
        // Make sure the player is not empty
        if (!player) {
            console.error('Player is empty');
            return;
        }
        try {
            // Add a player to the coach's team
            const response = await api.post('/users/coach/players/', { user_id: userId, player_id: player });
            // Success message
            enqueueSnackbar(response.data.message, { variant: response.data.status.toLowerCase() });
            // Close the modal on successful addition
            handleClose();
            // Call the onAddPlayer callback to refresh the players
            onAddPlayer();
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
    }

    // Get the players on mount
    useEffect(() => { getPlayers() }, []);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className={styles.modalBox}>
            <Typography variant="h6" component="h2" gutterBottom>
                Create New Session
            </Typography>
            <br />
            <br />
            <FormControl fullWidth>
                <InputLabel htmlFor="coach-player" >Add a player to the team:</InputLabel>
                <Select
                    label={'Add a player to the team:'}
                    id="coach-player"
                    value={player}
                    onChange={(e) => setPlayer(e.target.value)}
                    sx={{ height: 60 }}
                >
                    {
                        Array.isArray(players) && players.length > 0 ? (
                            players.map((p, index) => <MenuItem value={p.id.toString()} key={index}>{p.username}</MenuItem>)
                        ) : (
                            <MenuItem value="" disabled>No players available</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
            <br />
            <br />
            <Button variant="contained" color="success" onClick={handleAddPlayer}>
                Add Player
            </Button>
            </Box>
        </Modal>
    );
};

export default AddPlayerModal;