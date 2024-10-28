import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import contracaoImage from '../assets/contracao.png';
import flexaoImage from '../assets/flexao.png';
import heartImage from '../assets/frequencia-cardiaca.png';
import data from '../sample.json';

const Data: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [maxHeartRate, setMaxHeartRate] = useState<number | null>(null);
  const [bpm, setBpm] = useState(data.heart.bpm);
  const [bpmScale, setBpmScale] = useState(1);
  const [bpmData, setBpmData] = useState<{ time: string; bpm: number }[]>([]);

  // Dados de EMG para flexão e contração muscular
  const [flexDataRight, setFlexDataRight] = useState<{ time: string; value: number }[]>([]);
  const [flexDataLeft, setFlexDataLeft] = useState<{ time: string; value: number }[]>([]);
  const [muscleDataRight, setMuscleDataRight] = useState<{ time: string; value: number }[]>([]);
  const [muscleDataLeft, setMuscleDataLeft] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedAge = localStorage.getItem('userAge');
    if (storedName && storedAge) {
      setUserName(storedName);
      setUserAge(storedAge);
      setIsFormVisible(false);
      const age = parseInt(storedAge);
      setMaxHeartRate(220 - age);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    localStorage.setItem('userAge', userAge);
    setIsFormVisible(false);
  };

  const getCardColor = (bpm: number) => {
    if (bpm < maxHeartRate! * 0.6) return 'bg-green-500';
    if (bpm < maxHeartRate! * 0.7) return 'bg-yellow-500';
    if (bpm < maxHeartRate! * 0.8) return 'bg-orange-500';
    if (bpm < maxHeartRate! * 0.9) return 'bg-purple-500';
    return 'bg-red-500';
  };

  // Simulação do BPM
  useEffect(() => {
    const minBpm = 95;
    const maxBpm = 180;

    const interval = setInterval(() => {
      const newBpm = Math.floor(Math.random() * (maxBpm - minBpm + 1)) + minBpm;
      setBpm(newBpm);
      setBpmScale(1.15);
      setTimeout(() => setBpmScale(1), 500);

      setBpmData((prevData) => [
        ...prevData,
        { time: new Date().toLocaleTimeString(), bpm: newBpm },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Função para simular valores de EMG
  const simulateEMGData = () => {
    const newTime = new Date().toLocaleTimeString();

    // Simula valores para flexão e contração muscular
    setFlexDataRight(prev => [...prev, { time: newTime, value: Math.floor(Math.random() * 601) }]);
    setFlexDataLeft(prev => [...prev, { time: newTime, value: Math.floor(Math.random() * 601) }]);
    setMuscleDataRight(prev => [...prev, { time: newTime, value: Math.floor(Math.random() * 401) }]);
    setMuscleDataLeft(prev => [...prev, { time: newTime, value: Math.floor(Math.random() * 401) }]);
  };

  // Executa a simulação a cada 2 segundos
  useEffect(() => {
    const interval = setInterval(simulateEMGData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Função para determinar a cor com base no valor do EMG
  const getEMGColor = (value: number, isFlex: boolean) => {
    if (isFlex) {
      if (value <= 300) return '#4caf50'; // Baixo
      if (value <= 450) return '#ffeb3b'; // Moderado
      if (value <= 600) return '#ff9800'; // Alto
      return '#f44336'; // Muito Alto
    } else {
      if (value <= 150) return '#4caf50'; // Baixo
      if (value <= 250) return '#ffeb3b'; // Moderado
      if (value <= 350) return '#ff9800'; // Alto
      return '#f44336'; // Muito Alto
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen pt-5 sm:pt-10 px-4 py-5 overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(126,27,219,0.8), rgba(0,0,0,0.8))',
      }}
    >
      {isFormVisible ? (
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col items-center mb-5 w-full max-w-xs sm:max-w-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h2 className="text-white text-lg mb-4">Por favor, insira suas informações:</h2>
          <motion.input
            type="text"
            placeholder="Nome"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="p-2 mb-2 rounded w-full"
            required
          />
          <motion.input
            type="number"
            placeholder="Idade"
            value={userAge}
            onChange={(e) => setUserAge(e.target.value)}
            className="p-2 mb-4 rounded w-full"
            required
          />
          <button type="submit" className="bg-white text-purple-500 p-2 rounded w-full">
            Começar
          </button>
        </motion.form>
      ) : (
        <>
          <h1 className="text-white mb-5 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl mt-16 sm:mt-10">
            Informações de Saúde de {userName}, {userAge} anos
          </h1>
          <motion.div
            className={`shadow-md rounded-lg p-4 sm:p-5 mb-4 text-center transition-transform transform hover:scale-105 w-full max-w-md ${getCardColor(
              bpm
            )}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={heartImage}
              alt="Frequência Cardíaca"
              className="w-12 h-12 sm:w-16 sm:h-16 mb-4 mx-auto"
            />
            <p className="font-bold">BPM</p>
            <motion.p className="text-2xl" animate={{ scale: bpmScale }} transition={{ duration: 0.5 }}>
              {bpm}
            </motion.p>
            <p className="text-sm text-white">Signal Strength: {data.heart.sig}</p>

            <LineChart
              width={Math.min(window.innerWidth * 0.9, 420)}
              height={200}
              data={bpmData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              className="w-full max-w-xs sm:max-w-md"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fill: 'white', fontSize: 10 }} />
              <YAxis tick={{ fill: 'white', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: 'white' }} />
              <Legend wrapperStyle={{ color: 'white' }} />
              <Line type="monotone" dataKey="bpm" stroke="#5e4343" activeDot={{ r: 8 }} />
            </LineChart>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            {[
              { image: flexaoImage, title: 'Flexão do Braço Direito', data: flexDataRight, isFlex: true },
              { image: flexaoImage, title: 'Flexão do Braço Esquerdo', data: flexDataLeft, isFlex: true, mirror: true },
              { image: contracaoImage, title: 'Contração Muscular do Braço Direito', data: muscleDataRight, isFlex: false },
              { image: contracaoImage, title: 'Contração Muscular do Braço Esquerdo', data: muscleDataLeft, isFlex: false, mirror: true },
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 sm:p-5 text-center transition-transform transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className={`w-12 h-12 sm:w-16 sm:h-16 mb-4 mx-auto ${card.mirror ? 'transform scale-x-[-1]' : ''}`}
                />
                <p className="font-bold">{card.title}</p>

                {/* Gráfico do Card */}
                <LineChart
                  width={150}
                  height={100}
                  data={card.data}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  style={{ color: getEMGColor(card.data[card.data.length - 1]?.value || 0, card.isFlex) }} // Cor baseado no último valor
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 8 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', color: 'black' }} />
                  <Line type="monotone" dataKey="value" stroke={getEMGColor(card.data[card.data.length - 1]?.value || 0, card.isFlex)} />
                </LineChart>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Data;