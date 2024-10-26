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
      <div className="w-full max-w-5xl overflow-y-auto">
        {/* Primeiro cartão ocupa toda a largura */}
        <motion.div
          className="bg-white shadow-md rounded-lg p-5 mb-4 text-center transition-transform transform hover:scale-105 w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={heartImage} 
            alt="Frequência Cardíaca" 
            className="w-16 h-16 mb-4" 
          />
          <p className="font-bold">BPM</p>
          <p className="text-2xl">{data.heart.bpm}</p>
          <p className="text-sm text-gray-600">
            Signal Strength: {data.heart.sig}
          </p>
        </motion.div>

        {/* Cartões restantes em uma grade */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {[
            { image: flexaoImage, title: 'Flexão do Braço Esquerdo', value: data.arms.left.flex, alt: 'Flexão do Braço Esquerdo', mirror: true },
            { image: contracaoImage, title: 'Contração Muscular do Braço Esquerdo', value: data.arms.left.muscle, alt: 'Contração Muscular do Braço Esquerdo' },
            { image: flexaoImage, title: 'Flexão do Braço Direito', value: data.arms.right.flex, alt: 'Flexão do Braço Direito' },
            { image: contracaoImage, title: 'Contração Muscular do Braço Direito', value: data.arms.right.muscle, alt: 'Contração Muscular do Braço Direito', mirror: true },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md rounded-lg p-5 text-center transition-transform transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img 
                src={card.image} 
                alt={card.alt} 
                className={`w-16 h-16 mb-4 ${card.mirror ? 'transform scale-x-[-1]' : ''}`} 
              />
              <p className="font-bold">{card.title}</p>
              <p className="text-2xl">{card.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Data;
