import React from "react";
import api from "../../utils/api";
import { Box, Typography, Stack, Button } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import SessionLink from "../buttons/SessionLink";
import NewSession from "../buttons/NewSession";
import StopSession from "../buttons/StopSession";
import styles from "./LandingPage.module.css";
import PlayerSessionView from "./PlayerSessionView";
import CoachSessionView from "./CoachSessionView";

interface Session {
  session_id: string;
  session_name: string;
  time_start: string;
  time_end: string;
}

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
            <RefreshIcon />
          </Button>
        </Typography>
      </Box>

      { isCoach ? <CoachSessionView key={refreshKey} userId={userId} /> : <PlayerSessionView key={refreshKey} userId={userId} allowNewSession={true} /> }

    </Box>
  );
};

export default LandingPage;
