import React from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function NotFound() {

    const navigate = useNavigate();

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 10 }} >
                <ReportProblemIcon color="primary" sx={{ fontSize: 100 }}  />
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }} >
                    This page doesn't exist
                </Typography>
                <Typography variant='body1' color='gray' >
                    Please check your URL or return to home.
                </Typography>
                <Button
                    variant='outlined'
                    sx={{ borderRadius: '50px', mt: 4 }}
                    onClick={() => navigate('/')}
                >
                    Go to home
                </Button>
            </Box>
        </Container>
    )
}

export default NotFound;