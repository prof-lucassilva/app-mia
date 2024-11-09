import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import { Settings, User } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import mqtt from 'mqtt';

import contracaoImage from '../assets/contracao.png';
import flexaoImage from '../assets/flexao.png';
import heartImage from '../assets/frequencia-cardiaca.png';

// Simplified Card components
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`}>{children}</div>
);

const CardHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <h2 className={`text-xl font-semibold text-gray-800 ${className}`}>{children}</h2>
);

const CardContent: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="p-6">{children}</div>
);



// Custom Modal component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div>{children}</div>
        {actions && <div className="mt-4">{actions}</div>}
      </div>
    </div>
  );
};

const Data: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [bpm, setBpm] = useState(0);
  const [bpmScale, setBpmScale] = useState(1);
  const [bpmData, setBpmData] = useState<{ time: string; bpm: number }[]>([]);
  const [armData, setArmData] = useState<{
    time: string;
    rightFlex: number;
    leftFlex: number;
    rightMuscle: number;
    leftMuscle: number;
  }[]>([]);
  const [latestArmData, setLatestArmData] = useState({
    rightFlex: 0,
    leftFlex: 0,
    rightMuscle: 0,
    leftMuscle: 0,
  });
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSwitchUserModalOpen, setIsSwitchUserModalOpen] = useState(false);
  const [chartParams, setChartParams] = useState({
    bpmAttentionThreshold: 15000,
    bpmDangerThreshold: 17000,
    armAttentionThreshold: 28000,
    armDangerThreshold: 29000,
    updateInterval: 3000,
  });

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedAge = localStorage.getItem('userAge');
    if (storedName && storedAge) {
      setUserName(storedName);
      setUserAge(storedAge);
      setIsFormVisible(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    localStorage.setItem('userAge', userAge);
    setIsFormVisible(false);
  };

  // MQTT connection setup
  useEffect(() => {
    const client = mqtt.connect('wss://mqtt-dashboard.com:8884/mqtt');

    client.on('connect', () => {
      console.log('Conectado ao broker MQTT');
      client.subscribe('sensores/AD8232');
      client.subscribe('sensores/braco_direito');
      client.subscribe('sensores/biceps1');
      client.subscribe('sensores/braco_esquerdo');
      client.subscribe('sensores/biceps2');
    });

    client.on('message', (topic, message) => {
      const currentTime = new Date().toLocaleTimeString();

      if (topic === 'sensores/AD8232') {
        const newBpm = parseInt(message.toString(), 10);
        setBpm(newBpm);
        setBpmScale(1.15);
        setTimeout(() => setBpmScale(1), 500);

        setBpmData((prevData) => [
          ...prevData.slice(-20),
          { time: currentTime, bpm: newBpm },
        ]);
      } else {
        try {
          const value = parseInt(message.toString(), 10);

          setArmData((prevData) => {
            const lastEntry = prevData.length > 0 ? prevData[prevData.length - 1] : {
              time: currentTime,
              rightFlex: 0,
              leftFlex: 0,
              rightMuscle: 0,
              leftMuscle: 0
            };

            const newEntry = {
              time: currentTime,
              rightFlex: topic === 'sensores/braco_direito' ? value : lastEntry.rightFlex,
              leftFlex: topic === 'sensores/braco_esquerdo' ? value : lastEntry.leftFlex,
              rightMuscle: topic === 'sensores/biceps1' ? value : lastEntry.rightMuscle,
              leftMuscle: topic === 'sensores/biceps2' ? value : lastEntry.leftMuscle
            };

            return [...prevData.slice(-19), newEntry];
          });

          setLatestArmData((prevData) => ({
            ...prevData,
            rightFlex: topic === 'sensores/braco_direito' ? value : prevData.rightFlex,
            leftFlex: topic === 'sensores/braco_esquerdo' ? value : prevData.leftFlex,
            rightMuscle: topic === 'sensores/biceps1' ? value : prevData.rightMuscle,
            leftMuscle: topic === 'sensores/biceps2' ? value : prevData.leftMuscle,
          }));
        } catch (error) {
          console.error('Error parsing MQTT message:', error);
        }
      }
    });

    client.on('error', (error) => {
      console.error('Erro de conexão:', error);
    });

    return () => {
      client.end();
    };
  }, []);

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfigModalOpen(false);
  };

  const handleSwitchUser = () => {
    localStorage.clear();
    setUserName('');
    setUserAge('');
    setIsFormVisible(true);
    setIsSwitchUserModalOpen(false);
  };

  // Função para determinar a cor do card BPM
  const getBpmCardColor = () => {
    console.log('BPM:', bpm, 'Danger Threshold:', chartParams.bpmDangerThreshold);

    // Verifica se o BPM está em perigo
    if (bpm >= chartParams.bpmDangerThreshold) {
        const audio = new Audio('/mixkit-classic-short-alarm-993.wav');
        audio.play().catch((error) => {
            console.error('Erro ao reproduzir o áudio:', error);
        });
        return 'bg-red-700';
    }
    if (bpm >= chartParams.bpmAttentionThreshold) return 'bg-orange-400'; // Laranja
    return 'bg-white';
  };

  // Função para determinar a cor dos cards de flexões e contrações
  const getArmCardColor = (value: number) => {
    if (value >= chartParams.armDangerThreshold) {
      const audio = new Audio('/mixkit-classic-short-alarm-993.wav');
      audio.play().catch((error) => {
        console.error('Erro ao reproduzir o áudio:', error);
      });
      return 'bg-red-700';
    }
    if (value >= chartParams.armAttentionThreshold) {
      return 'bg-orange-400';
    }
    return 'bg-white';
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-radial from-purple-800 to-black p-4 md:p-8 overflow-y-auto"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(126,27,219,0.8), rgba(0,0,0,0.8))',
      }}
    >
      {/* Configuration Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="Configurar Parâmetros"
        actions={null /*
          <button
            type="submit"
            form="configForm"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Salvar Alterações
          </button>
    */}
      >
        <form id="configForm" onSubmit={handleConfigSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(chartParams).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {key === 'bpmAttentionThreshold' ? 'Limite de Atenção BPM' :
                    key === 'bpmDangerThreshold' ? 'Limite de Perigo BPM' :
                      key === 'armAttentionThreshold' ? 'Limite de Atenção Braço' :
                        key === 'armDangerThreshold' ? 'Limite de Perigo Braço' :
                          key === 'updateInterval' ? 'Intervalo de Atualização (ms)' :
                            key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="number"
                  id={key}
                  value={value}
                  onChange={(e) =>
                    setChartParams({
                      ...chartParams,
                      [key]: key === 'updateInterval' ? parseInt(e.target.value) : parseFloat(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  step={key.includes('Threshold') ? '1' : key === 'updateInterval' ? '100' : '1'}
                  min={key === 'updateInterval' ? 100 : 0}
                  max={key.includes('Threshold') ? '1000' : undefined}
                />
              </div>
            ))}
          </div>
        </form>
      </Modal>

      {/* Switch User Modal */}
      <Modal
        isOpen={isSwitchUserModalOpen}
        onClose={() => setIsSwitchUserModalOpen(false)}
        title="Trocar usuário"
      >
        <p>Tem certeza de que deseja trocar de usuário? Isso limpará todos os dados atuais.</p>
        <button
          onClick={handleSwitchUser}
          className="mt-4 mr-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Confirmar
        </button>
      </Modal>

      {/* Configuration and Switch User buttons */}
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button
          onClick={() => setIsSwitchUserModalOpen(true)}
          className="p-2 bg-white rounded-full shadow-md text-purple-500"
          aria-label="Mudar usuário"
        >
          <User size={24} />
        </button>
        <button
          onClick={() => setIsConfigModalOpen(true)}
          className="p-2 bg-white rounded-full shadow-md text-purple-500"
          aria-label="Abrir configurações"
        >
          <Settings size={24} />
        </button>
      </div>

      {isFormVisible ? (
        <motion.form
          onSubmit={handleSubmit}
          className="min-h-screen flex flex-col justify-center items-center bg-gradient-radial from-purple-800 to-black p-4 md:p-8 overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(126,27,219,0.8), rgba(0,0,0,0.8))',
          }}
        >
          <h2 className="text-white text-lg mb-2">Por favor, insira suas informações:</h2>
          <motion.input
            type="text"
            placeholder="Nome"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="p-2 mb-2 rounded lg:w-1/4 md:w-1/1"
            required
          />
          <motion.input
            type="number"
            placeholder="Idade"
            value={userAge}
            onChange={(e) => setUserAge(e.target.value)}
            className="p-2 mb-2 rounded lg:w-1/4 md:w-1/1"
            required
          />
          <button type="submit" className="bg-white text-purple-500 p-2 rounded lg:w-1/4 md:w-1/1">
            Começar
          </button>
        </motion.form>
      ) : (
        <>
          <h1 className="text-white mb-5 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl max-md:mt-10">
            Informações de Saúde de {userName}, {userAge} anos
          </h1>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-1/3">
              {/* Componente de BPM */}
              <motion.div
                className={`shadow-md rounded-lg p-4 text-center transition-transform transform hover:scale-105 w-full ${getBpmCardColor()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={heartImage}
                  alt="Frequência Cardíaca"
                  className="w-12 h-12 sm:w-16 sm:h-16 mb-4 mx-auto"
                />
                <p className="font-bold">Frquência Cardíaca</p>
                <motion.p className="text-2xl" animate={{ scale: bpmScale }} transition={{ duration: 0.5 }}>
                  {bpm}
                </motion.p>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bpmData} margin={{ top: 0, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[chartParams.bpmAttentionThreshold, chartParams.bpmDangerThreshold]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="bpm" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/3 w-full">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { image: flexaoImage, title: 'Flexão Braço Direito', value: latestArmData.rightFlex, alt: 'Flexão do Braço Direito', color: getArmCardColor(latestArmData.rightFlex) },
                  { image: flexaoImage, title: 'Flexão Braço Esquerdo', value: latestArmData.leftFlex, alt: 'Flexão do Braço Esquerdo', color: getArmCardColor(latestArmData.leftFlex), mirror: true },
                  { image: contracaoImage, title: 'Contração Muscular Braço Direito', value: latestArmData.rightMuscle, alt: 'Contração Muscular do Braço Direito', color: getArmCardColor(latestArmData.rightMuscle), mirror: true },
                  { image: contracaoImage, title: 'Contração Muscular Braço Esquerdo', value: latestArmData.leftMuscle, alt: 'Contração Muscular do Braço Esquerdo', color: getArmCardColor(latestArmData.leftMuscle) },
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    className={`shadow-md rounded-lg p-4 text-center transition-transform transform hover:scale-105 ${card.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <img
                      src={card.image}
                      alt={card.alt}
                      className={`w-12 h-12 mb-4 mx-auto ${card.mirror ? 'transform  scale-x-[-1]' : ''}`}
                    />
                    <p className="font-bold text-sm" style={{ color: card.color }}>{card.title}</p>
                    <p className="text-xl" style={{ color: card.color }}>{card.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* adicione um texto explicativo para quando o card/gráfico ficar vermelho e/ou laranja */}

            <div className="lg:w-1/3 w-full">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="text-center">Dados dos Braços ao Longo do Tempo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={armData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="time"
                            tick={{ fontSize: 12 }}
                            interval="preserveEnd"
                          />
                          <YAxis
                            domain={[0, 'auto']}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="rightFlex"
                            stroke="#8884d8"
                            name="Flexão Direita"
                            isAnimationActive={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="leftFlex"
                            stroke="#82ca9d"
                            name="Flexão Esquerda"
                            isAnimationActive={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="rightMuscle"
                            stroke="#ffc658"
                            name="Contração Direita"
                            isAnimationActive={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="leftMuscle"
                            stroke="#ff7300"
                            name="Contração Esquerda"
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Data