import React, { useState } from 'react';
import { Button } from '@mui/material';
import AddPlayerModal from '../modals/AddPlayerModal.tsx';

interface NewSessionProps {
    onAddPlayer: () => void;
}

const NewSession: React.FC<NewSessionProps> = ({ onAddPlayer }) => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button variant="contained" color="success" onClick={handleOpen}>
                Add a Player
            </Button>
            <AddPlayerModal open={open} handleClose={handleClose} onAddPlayer={onAddPlayer} />
        </>
    );
};

export default NewSession;