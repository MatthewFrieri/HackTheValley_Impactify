import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface SessionLinkProps {
    text: string;
    link: string;
}

const SessionLink: React.FC<SessionLinkProps> = ({ text, link }) => {
    // const navigate = useNavigate();
    
    const handleClick = () => {
        // navigate('/' + link);
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