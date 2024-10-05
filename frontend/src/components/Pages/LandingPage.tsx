import React from "react";
import api from "../../utils/api";
import { Box, Typography, Stack, Button } from "@mui/material";
import SessionLink from "../buttons/SessionLink";
import NewSession from "../buttons/NewSession";
import StopSession from "../buttons/StopSession";
import styles from "./LandingPage.module.css";

interface Session {
  session_id: string;
  session_name: string;
  time_start: string;
  time_end: string;
}

const LandingPage: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [recentSession, setRecentSession] = React.useState<Session | null>(
    null
  );

  const getUserSessions = async () => {
    setLoading(true);
    // Get the user ID from localStorage
    const userId = localStorage.getItem("user_id");
    // Using the users' ID, get all the sessions they have previously created
    // This will be used to display the previous sessions on the landing page
    const responseR = await api.get(`/users/session/`, { params: { user_id: userId } });
    const responseS = await api.get(`/users/session/all`, { params: { user_id: userId } });
    // Set the state to the session IDs
    setSessions(responseS.data);
    // Set the most recent session ID
    setRecentSession(responseR.data || null);
    // Stop loading
    setLoading(false);
  };

  React.useEffect(() => {
    // Get user sessions on mount
    getUserSessions();
  }, []);

  return (
    <Box className={styles.mainBox}>
      <Box className={styles.headerBox}>
        <Typography variant="h4">
          Hello {localStorage.getItem("username")} 👋
        </Typography>
        <Button variant="contained" color="primary" onClick={getUserSessions}>
          Refresh
        </Button>
        {(recentSession === null ||
          (recentSession && recentSession.time_end !== null)) && (
          <NewSession onNewSession={getUserSessions} />
        )}
        {recentSession && recentSession.time_end === null && (
          <StopSession onStopSession={getUserSessions} />
        )}
      </Box>

      <Typography variant="h6" gutterBottom textAlign={"left"}>
        Your Previous Sessions:
      </Typography>

      <Stack direction="row" spacing={2}>
        {loading ? (
          <Typography variant="body1" gutterBottom>
            Loading...
          </Typography>
        ) : Array.isArray(sessions) && sessions.length > 0 ? (
          sessions.map((s, index) => (
            <SessionLink
              sessionId={s.session_id}
              text={s.session_name}
              live={s.time_end === null}
              key={index}
            />
          ))
        ) : (
          <Typography variant="body1" gutterBottom>
            You have no sessions, create a new one to get started!
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default LandingPage;
