import React from "react";
import api from "../../utils/api";
import { Typography, Stack, Grid2 } from "@mui/material";
import SessionLink from "../buttons/SessionLink";
import NewSession from "../buttons/NewSession";
import StopSession from "../buttons/StopSession";

interface PlayerSessionViewProps {
    userId: string;
    allowNewSession: boolean;
}

interface Session {
  session_id: string;
  session_name: string;
  time_start: string;
  time_end: string;
}

const PlayerSessionView: React.FC<PlayerSessionViewProps> = ({ userId, allowNewSession }) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [canMakeSession, setCanMakeSession] = React.useState<boolean>(false);

  const getUserSessions = async () => {
    setLoading(true);
    // Using the users' ID, get all the sessions they have previously created
    // This will be used to display the previous sessions on the landing page
    const response = await api.get(`/users/session/all`, { params: { user_id: userId } });
    // If there are sessions, reverse the list so most recent is first
    response.data.data.reverse();
    // Set the state to the session IDs
    setSessions(response.data || []);
    // Can only make a session if there are no active sessions
    if (sessions.length === 0) {
        // Can make a session if there are no sessions
        setCanMakeSession(true);
    }
    else {
        // Can make a session if the last session has ended
        setCanMakeSession(response.data[0].time_end !== null);
    }
    // Stop loading
    setLoading(false);
  };

  React.useEffect(() => {
    // Get user sessions on mount
    getUserSessions();
  }, []);

    return (
        <>
            <Stack direction="column" spacing={2} alignItems="flex-start" sx={{ maxWidth: '600px', width: '100%', marginBottom: '20px' }}>
                {
                allowNewSession && (
                    canMakeSession ? (
                    <NewSession onNewSession={getUserSessions} />
                    ) : (
                    <StopSession onStopSession={getUserSessions} />
                    )
                )
                }
            </Stack>
            <Grid2 container columns={3} columnGap={3} rowGap={3}>
            {loading ? (
                <Typography variant="body1" gutterBottom>
                Loading...
                </Typography>
            ) : Array.isArray(sessions) && sessions.length > 0 ? (
                sessions.map((s, index) => (
                <SessionLink
                    session={s}
                    key={index}
                />
                ))
            ) : (
                <Typography variant="body1" gutterBottom>
                You have no sessions, create a new one to get started!
                </Typography>
            )}
            </Grid2>
        </>
    );
};

export default PlayerSessionView;
