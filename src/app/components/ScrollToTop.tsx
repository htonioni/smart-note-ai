'use client';
import { useState, useEffect } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // show button
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <Zoom in={isVisible}>
            <Fab
                onClick={scrollToTop}
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    left: 32,
                    bgcolor: '#0f172a',
                    color: 'white',
                    width: 56,
                    height: 56,
                    zIndex: 1000,
                    '&:hover': {
                        bgcolor: '#1e293b',
                        transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(15, 23, 42, 0.3)',
                }}
                aria-label="scroll to top"
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    );
};

export default ScrollToTop;
