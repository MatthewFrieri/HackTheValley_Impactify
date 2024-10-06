import React, { useState } from "react";
import { Button } from "@mui/material";
import CreateNewSession from "../modals/CreateNewSession.tsx";

interface NewSessionProps {
  onNewSession: () => void;
}

const NewSession: React.FC<NewSessionProps> = ({ onNewSession }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    localStorage.removeItem("sent_text");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="contained" color="success" onClick={handleOpen}>
        New Session +
      </Button>
      <CreateNewSession
        open={open}
        handleClose={handleClose}
        onNewSession={onNewSession}
      />
    </>
  );
};

export default NewSession;
