import React from 'react';
import api from '../../utils/api';
import { Box, Typography, Stack } from '@mui/material';
import SessionLink from '../buttons/SessionLink';
import NewSession from '../buttons/NewSession';
import styles from './LandingPage.module.css';

interface LandingPageProps {
    userId: string;
    username: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ userId, username }) => {

    const [loading, setLoading] = React.useState<boolean>(true);
    const [sessions, setSessions] = React.useState<string[]>([]);

    const getUserSessions = async () => {
        setLoading(true);
        // Using the users' ID, get all the sessions they have previously created
        // This will be used to display the previous sessions on the landing page
        const response = await api.get(`/users/sessions/${userId}`);
        // HACK: Since we don't have any data yet
        response.data = ["1", "2", "3", "4", "5"];
        // Set the state to the session IDs
        setSessions(response.data);
        setLoading(false);
    }

    React.useEffect(() => {
        // Get user sessions on mount
        getUserSessions();
    }, []);

    return (
        <Box className={styles.mainBox}>
            <Box className={styles.headerBox}>
                <Typography variant="h4">Hello {username} 👋</Typography> 
                <NewSession />
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