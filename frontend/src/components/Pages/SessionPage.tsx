import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LiveChart from '../charts/LiveChart';

const SessionPage: React.FC = () => {
    const location = useLocation();

    const getQueryParams = () => {
        return new URLSearchParams(location.search);
    };

    useEffect(() => {
        console.log(getQueryParams());
    }, []);

    return (
        <LiveChart sessionId={getQueryParams().get('session_id') || ''} />
    );
};

export default SessionPage;