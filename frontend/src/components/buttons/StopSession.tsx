import React, { useState } from 'react';
import { Button } from '@mui/material';
import StopCurrentSession from '../modals/StopCurrentSession.tsx';

interface StopSessionProps {
    onStopSession: () => void;
}

const StopSession: React.FC<StopSessionProps> = ({ onStopSession }) => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button variant="contained" color="error" onClick={handleOpen}>
                Stop Session -
            </Button>
            <StopCurrentSession open={open} handleClose={handleClose} onStopSession={onStopSession} />
        </>
    );
};

export default StopSession;