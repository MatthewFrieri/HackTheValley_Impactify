import React from 'react';
import api from '../../utils/api';
import { Box, Typography, Button, Card, CardContent, Stack } from '@mui/material';
import SessionLink from '../cmn/SessionLink';

interface LandingPageProps {
    userId: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ userId }) => {

    const [sessions, setSessions] = React.useState<string[]>([]);

    const getUserSessions = async () => {
        // Using the users' ID, get all the sessions they have previously created
        // This will be used to display the previous sessions on the landing page
        const response = await api.get(`/users/sessions/${userId}`);
        // HACK: Since we don't have any data yet
        response.data = ["1", "2", "3", "4", "5"];
        // Set the state to the session IDs
        setSessions(response.data);
    }

    React.useEffect(() => {
        // Get user sessions on mount
        getUserSessions();
    }, []);

    return (
        <Box 
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundColor: "#f0f0f0",
                backdropFilter: "blur(5px)",
                padding: "2rem",
            }}
        >
            <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                }}>
                <Typography variant="h4">Hello {/* Replace with actual user */} user</Typography> 
                <Button variant="contained" color="primary">
                    New Session +
                </Button>
            </Box>

            <Typography variant="h6" gutterBottom textAlign={'left'}>
                Your Previous Sessions:
            </Typography>

            <Stack direction="row" spacing={2}>
                { sessions.map((link, _) => <SessionLink link={link} text={"Game"} />) }
            </Stack> 
        </Box>
    );
};

export default LandingPage;