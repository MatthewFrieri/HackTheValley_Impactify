import React, { useState } from 'react';
import Button from '@mui/material/Button';
import StopCurrentSession from '../modals/StopCurrentSession';

const NewSession: React.FC = () => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button variant="contained" color="error" onClick={handleOpen}>
                Stop Session -
            </Button>
            <StopCurrentSession open={open} handleClose={handleClose} />
        </>
    );
};

export default NewSession;