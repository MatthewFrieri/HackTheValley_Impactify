// components/Layout.tsx
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './SideBar/sidebar.tsx';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
