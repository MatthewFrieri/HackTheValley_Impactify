import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CreateNewSession from '../modals/CreateNewSession';

const NewSession: React.FC = () => {

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                New Session +
            </Button>
            <CreateNewSession open={open} handleClose={handleClose} />
        </>
    );
};

export default NewSession;