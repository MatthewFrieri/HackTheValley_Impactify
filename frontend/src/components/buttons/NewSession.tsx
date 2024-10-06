import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CreateNewSession from '../modals/CreateNewSession';

interface NewSessionProps {
    onNewSession: () => void;
}

const NewSession: React.FC<NewSessionProps> = ({ onNewSession }) => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button variant="contained" color="success" onClick={handleOpen}>
                New Session +
            </Button>
            <CreateNewSession open={open} handleClose={handleClose} onNewSession={onNewSession} />
        </>
    );
};

export default NewSession;