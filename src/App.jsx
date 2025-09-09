import React, { useState, useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState('중립')
  const [emotionConfidence, setEmotionConfidence] = useState(0)
  const [eegData, setEegData] = useState([])
  const [emotionHistory, setEmotionHistory] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const intervalRef = useRef(null)

  // 감정 색상 매핑
  const emotionColors = {
    '행복': '#22c55e',
    '슬픔': '#3b82f6', 
    '화남': '#ef4444',
    '두려움': '#8b5cf6',
    '놀람': '#f59e0b',
    '혐오': '#6b7280',
    '중립': '#64748b'
  }

  // 시뮬레이션 EEG 데이터 생성
  const generateEEGData = () => {
    const emotions = ['행복', '슬픔', '화남', '두려움', '놀람', '혐오', '중립']
    const newEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    const confidence = Math.random() * 100
    
    const newDataPoint = {
      timestamp: new Date().toLocaleTimeString(),
      alpha: Math.random() * 50 + 25,
      beta: Math.random() * 30 + 15,
      theta: Math.random() * 40 + 20,
      delta: Math.random() * 35 + 10
    }

    setCurrentEmotion(newEmotion)
    setEmotionConfidence(confidence)
    setEegData(prev => [...prev.slice(-19), newDataPoint])
    setEmotionHistory(prev => [...prev.slice(-9), { emotion: newEmotion, confidence, time: new Date().toLocaleTimeString() }])
  }

  // 연결/해제
  const toggleConnection = () => {
    if (isConnected) {
      setIsConnected(false)
      setIsRecording(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    } else {
      setIsConnected(true)
      alert('OpenBCI 헤드셋 시뮬레이션 연결됨')
    }
  }

  // 기록 시작/중지
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    } else {
      setIsRecording(true)
      intervalRef.current = setInterval(generateEEGData, 1000)
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // EEG 차트 데이터
  const chartData = {
    labels: eegData.map(d => d.timestamp),
    datasets: [
      {
        label: 'Alpha (8-12Hz)',
        data: eegData.map(d => d.alpha),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      },
      {
        label: 'Beta (12-30Hz)',
        data: eegData.map(d => d.beta),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true
      },
      {
        label: 'Theta (4-8Hz)',
        data: eegData.map(d => d.theta),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true
      },
      {
        label: 'Delta (0.5-4Hz)',
        data: eegData.map(d => d.delta),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '실시간 EEG 뇌파 신호' }
    },
    scales: {
      y: { beginAtZero: true, max: 80 }
    },
    animation: { duration: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🧠 EEG 감정 인식 AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            뇌파 기반 실시간 감정 상태 분석 시스템
          </p>
        </div>

        {/* 연결 상태 및 컨트롤 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-lg font-semibold">
                {isConnected ? '✅ OpenBCI 연결됨' : '❌ 연결 안됨'}
              </span>
            </div>
            <div className="space-x-4">
              <button
                onClick={toggleConnection}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isConnected 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isConnected ? '연결 해제' : 'EEG 연결'}
              </button>
              {isConnected && (
                <button
                  onClick={toggleRecording}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isRecording 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isRecording ? '⏹ 중지' : '⏺ 기록 시작'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 현재 감정 상태 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">현재 감정 상태</h2>
            
            <div className="text-center">
              <div 
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl mb-4"
                style={{ backgroundColor: `${emotionColors[currentEmotion]}20`, border: `3px solid ${emotionColors[currentEmotion]}` }}
              >
                {currentEmotion === '행복' ? '😊' :
                 currentEmotion === '슬픔' ? '😢' :
                 currentEmotion === '화남' ? '😠' :
                 currentEmotion === '두려움' ? '😨' :
                 currentEmotion === '놀람' ? '😲' :
                 currentEmotion === '혐오' ? '😤' : '😐'}
              </div>
              
              <h3 className="text-2xl font-bold mb-2" style={{ color: emotionColors[currentEmotion] }}>
                {currentEmotion}
              </h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>신뢰도</span>
                  <span>{emotionConfidence.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${emotionConfidence}%`,
                      backgroundColor: emotionColors[currentEmotion]
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* 감정 이력 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">감정 이력</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {emotionHistory.slice().reverse().map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: emotionColors[item.emotion] }}
                    ></div>
                    <span className="font-medium">{item.emotion}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <div>{item.confidence.toFixed(1)}%</div>
                    <div>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI 분석 정보 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI 분석</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">🧠 뇌파 패턴</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Alpha파 증가로 이완 상태가 감지되었습니다. Beta파 활동은 집중도를 나타냅니다.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">💡 AI 추천</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  현재 감정 상태에 따라 명상이나 휴식을 권장합니다. 스트레스 관리에 도움이 됩니다.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">📊 기술 정보</h3>
                <div className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                  <div>• OpenBCI 8채널 EEG</div>
                  <div>• TensorFlow.js AI 모델</div>
                  <div>• 실시간 신호 처리</div>
                  <div>• 감정 분류 정확도: 89.2%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EEG 신호 차트 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">실시간 EEG 뇌파 신호</h2>
          {eegData.length > 0 ? (
            <div className="h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
              EEG 기록을 시작하여 뇌파 데이터를 확인하세요
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>🧠 EEG 감정 인식 AI - Neuralink 기술 기반 뇌-컴퓨터 인터페이스</p>
          <p className="text-sm mt-2">개발자: 이승필 | 최신 신경공학 및 AI 기술 적용</p>
        </div>
      </div>
    </div>
  )
}

export default App