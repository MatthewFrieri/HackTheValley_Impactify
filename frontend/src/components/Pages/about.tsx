import React from 'react';
import {
    Avatar,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Box,
} from '@mui/material';
import { Email, Phone, LinkedIn } from '@mui/icons-material';

const AboutMe: React.FC = () => {
    return (
        <Card
            sx={{
                maxWidth: 800,
                margin: 'auto',
                mt: 5,
                p: 3,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Grid container spacing={4} alignItems="center">
                {/* Profile Section */}
                <Grid item xs={12} md={4} textAlign="center">
                    <Avatar
                        alt="Your Name"
                        src="/path/to/your/photo.jpg"
                        sx={{ width: 150, height: 150, margin: 'auto' }}
                    />
                    <Typography variant="h5" mt={2}>
                        Your Name
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Your Profession
                    </Typography>
                </Grid>

                {/* About Me Section */}
                <Grid item xs={12} md={8}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            About Me
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {/* Replace with your own description */}
                            I'm a passionate developer with experience in building web
                            applications using React and Material-UI. I love creating
                            user-friendly interfaces and seamless user experiences.
                        </Typography>

                        {/* Contact Information */}
                        <Box mt={2}>
                            <Typography variant="h6" gutterBottom>
                                Contact
                            </Typography>
                            <Button
                                startIcon={<Email />}
                                href="mailto:your.email@example.com"
                                sx={{ textTransform: 'none', mr: 2 }}
                            >
                                your.email@example.com
                            </Button>
                            <Button
                                startIcon={<Phone />}
                                href="tel:+1234567890"
                                sx={{ textTransform: 'none', mr: 2 }}
                            >
                                +1 (234) 567-890
                            </Button>
                            <Button
                                startIcon={<LinkedIn />}
                                href="https://www.linkedin.com/in/yourprofile"
                                target="_blank"
                                sx={{ textTransform: 'none' }}
                            >
                                LinkedIn Profile
                            </Button>
                        </Box>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    );
};

export default AboutMe;
