import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface SessionLinkProps {
    sessionId: string;
    text: string;
    live: boolean;
}

const SessionLink: React.FC<SessionLinkProps> = ({ sessionId, text, live }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        const url = new URL(`/chart`, window.location.origin);
        // Append the session ID to the URL
        url.searchParams.append('session_id', sessionId);
        url.searchParams.append('live', live.toString());
        // Navigate to the new URL
        navigate(url.pathname + url.search);
    };

    return (
        <Card>
            <CardActionArea onClick={handleClick}>
                <CardContent>
                    <Typography variant="h5" component="div" align="center">
                        {text}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default SessionLink;