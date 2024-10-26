import React from 'react';
import { motion } from 'framer-motion';
import data from '../sample.json';
import heartImage from '../assets/frequencia-cardiaca.png';
import flexaoImage from '../assets/flexao.png';
import contracaoImage from '../assets/contracao.png';

const Data: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-purple-500 p-5">
      <h1 className="text-white mb-5 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
        Informações de Saúde
      </h1>
      <div className="flex flex-wrap justify-center w-full max-w-5xl overflow-y-auto">
        {[
          { image: heartImage, title: 'BPM', value: data.heart.bpm, sig: data.heart.sig, alt: 'Frequência Cardíaca' },
          { image: flexaoImage, title: 'Flexão do Braço Esquerdo', value: data.arms.left.flex, alt: 'Flexão do Braço Esquerdo', mirror: true },
          { image: contracaoImage, title: 'Contração Muscular do Braço Esquerdo', value: data.arms.left.muscle, alt: 'Contração Muscular do Braço Esquerdo' },
          { image: flexaoImage, title: 'Flexão do Braço Direito', value: data.arms.right.flex, alt: 'Flexão do Braço Direito' },
          { image: contracaoImage, title: 'Contração Muscular do Braço Direito', value: data.arms.right.muscle, alt: 'Contração Muscular do Braço Direito', mirror: true },
        ].map((card, index) => (
          <motion.div
            key={index}
            className={`bg-white shadow-md rounded-lg p-5 m-2 text-center transition-transform transform hover:scale-105 flex-1 ${
              index === 0 ? 'w-full sm:w-2/3 lg:w-1/2' : 'max-w-xs'
            }`} // Ajustando a largura do cartão BPM
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <img 
              src={card.image} 
              alt={card.alt} 
              className={`w-16 h-16 mb-4 ${card.mirror ? 'transform scale-x-[-1]' : ''}`} 
            />
            <p className="font-bold">{card.title}</p>
            <p className="text-2xl">{card.value}</p>
            {index === 0 && ( // Condição para mostrar "Signal Strength" apenas no primeiro cartão
              <p className="text-sm text-gray-600">
                Signal Strength: {card.sig}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Data;
