"use client"

import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'

import contracaoImage from '../assets/contracao.png'
import flexaoImage from '../assets/flexao.png'
import heartImage from '../assets/frequencia-cardiaca.png'
import data from '../sample.json'

// Simplified Card components
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`}>{children}</div>
)

const CardHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
)

const CardTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-800">{children}</h2>
)

const CardContent: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="p-6">{children}</div>
)

const Data: React.FC = () => {
  const [userName, setUserName] = useState('')
  const [userAge, setUserAge] = useState('')
  const [isFormVisible, setIsFormVisible] = useState(true)
  const [maxHeartRate, setMaxHeartRate] = useState<number | null>(null)
  const [bpm, setBpm] = useState(data.heart.bpm)
  const [bpmScale, setBpmScale] = useState(1)
  const [bpmData, setBpmData] = useState<{ time: string; bpm: number }[]>([])
  const [armData, setArmData] = useState<{
    time: string;
    rightFlex: number;
    leftFlex: number;
    rightMuscle: number;
    leftMuscle: number;
  }[]>([])
  const [latestArmData, setLatestArmData] = useState({
    rightFlex: 0,
    leftFlex: 0,
    rightMuscle: 0,
    leftMuscle: 0
  });

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    const storedAge = localStorage.getItem('userAge')
    if (storedName && storedAge) {
      setUserName(storedName)
      setUserAge(storedAge)
      setIsFormVisible(false)
      const age = parseInt(storedAge)
      setMaxHeartRate(220 - age)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('userName', userName)
    localStorage.setItem('userAge', userAge)
    setIsFormVisible(false)
  }

  const getCardColor = (bpm: number) => {
    if (bpm < maxHeartRate! * 0.7) return 'bg-green-500'
    if (bpm < maxHeartRate! * 0.8) return 'bg-yellow-500'
    if (bpm < maxHeartRate! * 0.9) return 'bg-orange-500'
    return 'bg-red-500'
  }

  // Simulated BPM data update
  useEffect(() => {
    const minBpm = 95
    const maxBpm = 180

    const interval = setInterval(() => {
      const newBpm = Math.floor(Math.random() * (maxBpm - minBpm + 1)) + minBpm
      setBpm(newBpm)
      setBpmScale(1.15)
      setTimeout(() => setBpmScale(1), 500)

      const currentTime = new Date().toLocaleTimeString()

      setBpmData((prevData) => [
        ...prevData.slice(-20),
        { time: currentTime, bpm: newBpm },
      ])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simulated arm data update
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString()
      const newArmData = {
        time: currentTime,
        rightFlex: Math.floor(Math.random() * 1024),
        leftFlex: Math.floor(Math.random() * 1024),
        rightMuscle: Math.floor(Math.random() * 1024),
        leftMuscle: Math.floor(Math.random() * 1024),
      };
      setArmData((prevData) => [...prevData.slice(-20), newArmData]);
      setLatestArmData(newArmData);
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
  className="min-h-screen flex flex-col bg-gradient-radial from-purple-800 to-black p-4 md:p-8 overflow-y-auto"
  style={{
    backgroundImage: 'radial-gradient(circle, rgba(126,27,219,0.8), rgba(0,0,0,0.8))',
  }}
>
  {isFormVisible ? (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col items-center mb-5 w-full max-w-xs sm:max-w-sm mx-auto mt-4"
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
      <h1 className="text-white mb-5 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl mt-30 sm:mt-10">
        Informações de Saúde de {userName}, {userAge} anos
      </h1>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/3">
          {/* Componente de BPM */}
          <motion.div
            className={`shadow-md rounded-lg p-4 sm:p-5 mb-4 text-center transition-transform transform hover:scale-105 w-full ${getCardColor(
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
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bpmData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fill: 'white', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'white', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: 'black' }} />
                  <Legend wrapperStyle={{ color: 'white' }} />
                  <Line type="monotone" dataKey="bpm" stroke="#ffffff" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

            <div className="lg:w-1/3">
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { image: flexaoImage, title: 'Flexão Braço Direito', value: latestArmData.rightFlex, alt: 'Flexão do Braço Direito' },
                  { image: flexaoImage, title: 'Flexão Braço Esquerdo', value: latestArmData.leftFlex, alt: 'Flexão do Braço Esquerdo', mirror: true },
                  { image: contracaoImage, title: 'Contração Muscular Braço Direito', value: latestArmData.rightMuscle, alt: 'Contração Muscular do Braço Direito', mirror: true },
                  { image: contracaoImage, title: 'Contração Muscular Braço Esquerdo', value: latestArmData.leftMuscle, alt: 'Contração Muscular do Braço Esquerdo' },
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-4 text-center transition-transform transform hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <img
                      src={card.image}
                      alt={card.alt}
                      className={`w-12 h-12 mb-4 mx-auto ${card.mirror ? 'transform scale-x-[-1]' : ''}`}
                    />
                    <p className="font-bold text-sm">{card.title}</p>
                    <p className="text-xl">{card.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Dados dos Braços ao Longo do Tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={armData}
                        margin={{ top: 0, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: 'black' }} />
                        <Legend />
                        <Line type="monotone" dataKey="rightFlex" stroke="#8884d8" name="Flexão Direita" />
                        <Line type="monotone" dataKey="leftFlex" stroke="#82ca9d" name="Flexão Esquerda" />
                        <Line type="monotone" dataKey="rightMuscle" stroke="#ffc658" name="Contração Direita" />
                        <Line type="monotone" dataKey="leftMuscle" stroke="#ff7300" name="Contração Esquerda" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Data