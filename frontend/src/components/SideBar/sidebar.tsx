// components/SideBar/sidebar.tsx
import React, { useState, useEffect } from 'react';
import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    ListItemButton,
    Box,
    Collapse,
    CircularProgress,
} from '@mui/material';
import {
    Info,
    Dashboard,
    BarChart,
    Logout,
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Adjust the import path to your API module

const drawerWidth = 200;

interface Session {
    id: number;
    name: string;
}

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [sessionsOpen, setSessionsOpen] = useState<boolean>(false);

    useEffect(() => {
        getUserSessions();
    }, []);

    const getUserSessions = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('user_id');
            const responseS = await api.get(`/users/session/all`, {
                params: { user_id: userId },
            });
            const sessionData = responseS.data.data.reverse();

            // Transform sessions to have consistent property names
            const transformedSessions = sessionData.map((session: any) => ({
                id: session.id || session.session_id,
                name: session.name || session.session_name || `Session ${session.id || session.session_id}`,
            }));

            setSessions(transformedSessions || []);
            console.log('Transformed sessions in Sidebar:', transformedSessions);
        } catch (error) {
            console.error('Error fetching user sessions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Remove user data from local storage
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        localStorage.removeItem('user_type');
        // Redirect to login page
        navigate('/login');
    };

    const menuItems = [
        { text: 'About', icon: <Info />, path: '/about' },
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Toolbar />
            <Divider />
            <Box sx={{ flexGrow: 1 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.text}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}

                    {/* Sessions dropdown */}
                    <ListItemButton onClick={() => setSessionsOpen(!sessionsOpen)}>
                        <ListItemIcon>
                            <BarChart />
                        </ListItemIcon>
                        <ListItemText primary="Sessions" />
                        {sessionsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={sessionsOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {loading ? (
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        <CircularProgress size={20} />
                                    </ListItemIcon>
                                    <ListItemText primary="Loading..." />
                                </ListItemButton>
                            ) : sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <ListItemButton
                                        key={session.id}
                                        sx={{ pl: 4 }}
                                        onClick={() => navigate(`/sessions/${session.id}`)}
                                    >
                                        <ListItemText
                                            primary={session.name || `Session ${session.id}`}
                                        />
                                    </ListItemButton>
                                ))
                            ) : (
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemText primary="No sessions available" />
                                </ListItemButton>
                            )}
                        </List>
                    </Collapse>
                </List>
            </Box>
            <Divider />
            <List>
                <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </List>
        </Drawer>
    );
};

export default Sidebar;
