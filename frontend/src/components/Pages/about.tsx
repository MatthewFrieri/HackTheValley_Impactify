import React from 'react';
import {
    Container,
    Typography,
    Paper,
    Button,
    Box, Grid2,
} from '@mui/material';

const AboutPage: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Hero Section */}
            <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        color: '#222',
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                >
                    About NULL
                </Typography>
                <Typography
                    variant="h6"
                    component="p"
                    color="textSecondary"
                    sx={{
                        maxWidth: 800,
                        mx: 'auto',
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        lineHeight: 1.8,
                        color: '#555'
                    }}
                >
                    Revolutionizing combat sports by integrating technology into sports headwear to monitor and give insights on your brain health.
                </Typography>
            </Box>

            {/* Mission Section */}
            <Box sx={{ my: 10 }}>
                <Paper elevation={3} sx={{ p: 6, backgroundColor: '#fafafa', textAlign: 'center', borderRadius: 3 }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            color: '#1976d2',
                            mb: 2
                        }}
                    >
                        Our Motivation
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: '1.25rem',
                            lineHeight: 1.75,
                            color: '#444'
                        }}
                    >
                        our motivation is driven by the alarming risks of brain injuries in physical sports like boxing, football, and hockey. Studies show that 87% of boxers experience at least one concussion during their career, and in American football, 99% of NFL players studied showed signs of CTE. In ice hockey, concussions make up 15-30% of all injuries, raising serious concerns about long-term brain health. We are committed to using cutting-edge sensor technology to monitor impacts in real time, helping athletes reduce their risk of brain injuries and protect their future health.
                    </Typography>
                </Paper>
            </Box>

            {/* Vision Section */}
            <Box sx={{ my: 10 }}>
                <Paper elevation={3} sx={{ p: 6, backgroundColor: '#f4f7fc', textAlign: 'center', borderRadius: 3 }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            color: '#1976d2',
                            mb: 2
                        }}
                    >
                        Our Vision
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: '1.25rem',
                            lineHeight: 1.75,
                            color: '#444'
                        }}
                    >
                        We envision a world where athletes are empowered by technology to prevent injuries,
                        optimize performance, and safeguard their long-term brain health,
                        ensuring a safer and more sustainable future for combat sports.
                    </Typography>
                </Paper>
            </Box>

            {/* Key Features Section */}
            <Box sx={{ my: 12 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: '#333',
                        mb: 5
                    }}
                >
                    Key Features
                </Typography>
                <Grid2 container spacing={4} justifyContent="center">
                    <Grid2 xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                borderRadius: 3
                            }}
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#1976d2',
                                    mb: 1.5
                                }}
                            >
                                Real-Time Impact Analysis
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#666',
                                    lineHeight: 1.7
                                }}
                            >
                                Our system uses an ESP32, accelerometer, and pressure sensors to measure the force of impacts during training and fights,
                                giving athletes and coaches real-time data to assess performance and risks.
                            </Typography>
                        </Paper>
                    </Grid2>
                    <Grid2 xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                borderRadius: 3
                            }}
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#1976d2',
                                    mb: 1.5
                                }}
                            >
                                Brain Health Monitoring
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#666',
                                    lineHeight: 1.7
                                }}
                            >
                                By leveraging accelerometers, we monitor head movement and acceleration to track potential brain trauma,
                                helping athletes avoid long-term injuries and providing a safer training environment.
                            </Typography>
                        </Paper>
                    </Grid2>
                    <Grid2 xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                borderRadius: 3
                            }}
                        >
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#1976d2',
                                    mb: 1.5
                                }}
                            >
                                Performance Insights & Session Tracking
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#666',
                                    lineHeight: 1.7
                                }}
                            >
                                Our platform offers comprehensive session tracking with detailed insights into each athlete's performance,
                                empowering data-driven training and progress monitoring over time.
                            </Typography>
                        </Paper>
                    </Grid2>
                </Grid2>
            </Box>

            {/* Call to Action */}
            <Box sx={{ textAlign: 'center', my: 10 }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                        fontSize: '1.2rem',
                        px: 6,
                        py: 2,
                        borderRadius: 3,
                        textTransform: 'none'
                    }}
                >
                    Learn More About Our Technology
                </Button>
            </Box>
        </Container>
    );
};

export default AboutPage;
