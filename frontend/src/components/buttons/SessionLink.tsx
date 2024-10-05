import React from 'react';
import moment from 'moment';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Session {
    session_id: string;
    session_name: string;
    time_start: string;
    time_end: string;
}

interface SessionLinkProps {
    session: Session;
}

const SessionLink: React.FC<SessionLinkProps> = ({ session }) => {
    // Use the navigate hook to navigate to the chart page
    const navigate = useNavigate();
    
    // If the current session is live
    const isLive = session.time_end === null;
    
    const handleClick = () => {
        const url = new URL(`/chart`, window.location.origin);
        // Append the session ID to the URL
        url.searchParams.append('session_id', session.session_id);
        url.searchParams.append('live', isLive ? 'true' : 'false');
        // Navigate to the new URL
        navigate(url.pathname + url.search);
    };

    return (
        <Card style={{ width: '300px' }}>
            <CardActionArea onClick={handleClick}>
                <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5" component="div">
                        {session.session_name}
                    </Typography>
                    {
                        isLive ? (
                            <Typography variant="body2" color="error">
                                Live 🔴
                            </Typography>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                {moment(session.time_start).fromNow()}
                            </Typography>
                        )
                    }
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default SessionLink;