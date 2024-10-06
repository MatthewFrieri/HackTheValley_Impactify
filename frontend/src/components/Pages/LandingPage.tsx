import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Refresh } from '@mui/icons-material';
import styles from "./LandingPage.module.css";
import PlayerSessionView from "./PlayerSessionView.tsx";
import CoachSessionView from "./CoachSessionView.tsx";

const LandingPage: React.FC = () => {

  const userId = localStorage.getItem("user_id") || "";
  const isCoach = localStorage.getItem("user_type") === "coach";
  const [refreshKey, setRefreshKey] = React.useState(0);

  const refresh = async () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <Box className={styles.mainBox}>
      <Box className={styles.headerBox}>
        <Typography variant="h4">
          Hello {localStorage.getItem("username")} 👋
        </Typography>
        <Typography variant="h6" gutterBottom textAlign={"left"} padding={2}>
          Refresh Sessions:
          <Button variant="text" onClick={refresh} size="small">
            <Refresh sx={{ color: "green" }} />
          </Button>
        </Typography>
      </Box>

      { isCoach ? <CoachSessionView key={refreshKey} userId={userId} /> : <PlayerSessionView key={refreshKey} userId={userId} allowNewSession={true} /> }

    </Box>
  );
};

export default LandingPage;
