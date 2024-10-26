import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import miaLogo from '../assets/mia_logo.png';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [isExiting, setIsExiting] = useState(false);

    const handleStartClick = () => {
        setIsExiting(true);
        setTimeout(() => navigate('/data'), 1500);
    };

    return (
        <motion.div
            style={styles.container}
            initial={{ opacity: 1 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ duration: 1 }}
        >
            <motion.img
                src={miaLogo}
                alt="MIA Logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, x: isExiting ? -200 : 0 }}
                transition={{ duration: 1 }}
                style={styles.logo}
            />
            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, x: isExiting ? 200 : 0 }}
                transition={{ delay: 1, duration: 1 }}
                style={styles.text}
            >
                é para todos.
            </motion.h2>
            <motion.button
                onClick={handleStartClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, x: isExiting ? -200 : 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                style={styles.button}
            >
                Começar!
            </motion.button>
        </motion.div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        backgroundImage: 'radial-gradient(circle, rgba(126,27,219,0.8), rgba(0,0,0,0.8))',
        textAlign: 'center' as const,
        overflow: 'hidden',
    },
    logo: {
        width: '200px',
        marginBottom: '1rem',
    },
    text: {
        fontSize: '1.5rem',
        fontWeight: 300,
        color: '#d8d8d8',
        fontFamily: 'Montserrat, sans-serif',
    },
    button: {
        marginTop: '1.5rem',
        padding: '0.8rem 2rem',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#7e1bdb',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default Home;
