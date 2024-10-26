import React from 'react';
import { motion } from 'framer-motion';
import data from '../sample.json';
import heartImage from '../assets/frequencia-cardiaca.png';
import flexaoImage from '../assets/flexao.png';
import contracaoImage from '../assets/contracao.png';

const cardStyle = {
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '20px',
  margin: '10px',
  textAlign: 'center' as const,
  transition: 'transform 0.5s',
  flex: '1 1 calc(100% - 20px)', // Full width on mobile
  maxWidth: '300px', // Limit width on larger screens
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'flex-start' as const, // Start from the top
  minHeight: '100vh',
  backgroundColor: '#9f7aea',
  padding: '20px',
  overflowY: 'auto' as const,
};

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  justifyContent: 'center' as const,
  width: '100%',
  maxWidth: '1200px', // Limit grid width on larger screens
};

const Data: React.FC = () => {
  return (
    <div style={containerStyle}>
      <h1 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Informações de Saúde</h1>
      <div style={gridStyle}>
        <motion.div
          style={cardStyle}
          whileHover={{ scale: 1.05 }}
        >
          <img src={heartImage} alt="Frequência Cardíaca" style={{ width: '64px', height: '64px', marginBottom: '16px' }} />
          <p style={{ fontWeight: 'bold' }}>BPM</p>
          <p style={{ fontSize: '24px' }}>{data.heart.bpm}</p>
        </motion.div>
        <motion.div
          style={cardStyle}
          whileHover={{ scale: 1.05 }}
        >
          <img src={flexaoImage} alt="Flexão do Braço Esquerdo" style={{ width: '64px', height: '64px', marginBottom: '16px', transform: 'scaleX(-1)' }} />
          <p style={{ fontWeight: 'bold' }}>Flexão do Braço Esquerdo</p>
          <p style={{ fontSize: '24px' }}>{data.arms.left.flex}</p>
        </motion.div>
        <motion.div
          style={cardStyle}
          whileHover={{ scale: 1.05 }}
        >
          <img src={contracaoImage} alt="Contração Muscular do Braço Esquerdo" style={{ width: '64px', height: '64px', marginBottom: '16px', transform: 'scaleX(-1)' }} />
          <p style={{ fontWeight: 'bold' }}>Contração Muscular do Braço Esquerdo</p>
          <p style={{ fontSize: '24px' }}>{data.arms.left.muscle}</p>
        </motion.div>
        <motion.div
          style={cardStyle}
          whileHover={{ scale: 1.05 }}
        >
          <img src={flexaoImage} alt="Flexão do Braço Direito" style={{ width: '64px', height: '64px', marginBottom: '16px' }} />
          <p style={{ fontWeight: 'bold' }}>Flexão do Braço Direito</p>
          <p style={{ fontSize: '24px' }}>{data.arms.right.flex}</p>
        </motion.div>
        <motion.div
          style={cardStyle}
          whileHover={{ scale: 1.05 }}
        >
          <img src={contracaoImage} alt="Contração Muscular do Braço Direito" style={{ width: '64px', height: '64px', marginBottom: '16px' }} />
          <p style={{ fontWeight: 'bold' }}>Contração Muscular do Braço Direito</p>
          <p style={{ fontSize: '24px' }}>{data.arms.right.muscle}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Data;
