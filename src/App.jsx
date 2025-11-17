import React, { useState, useEffect, useRef } from 'react'
import { Line, Bar, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import RealtimeMonitor from './components/RealtimeMonitor'
import AdvancedAnalytics from './components/AdvancedAnalytics'
import ClinicalReport from './components/ClinicalReport'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isConnected, setIsConnected] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState('중립')
  const [emotionConfidence, setEmotionConfidence] = useState(0)
  const [eegData, setEegData] = useState([])
  const [emotionHistory, setEmotionHistory] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [sessionHistory, setSessionHistory] = useState([])
  const [userName, setUserName] = useState('환자')
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
    
    // 세션 기록 추가
    if (isRecording) {
      setSessionHistory(prev => [...prev, {
        id: Date.now(),
        emotion: newEmotion,
        confidence,
        timestamp: new Date(),
        eegData: newDataPoint
      }])
    }
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

  // 페이지 렌더링 함수들
  const renderNavigation = () => (
    <nav className="bg-white dark:bg-gray-800 shadow-lg mb-8 rounded-xl">
      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-2 lg:gap-4 justify-center">
          {[
            { id: 'dashboard', name: '📊 대시보드', icon: '📊' },
            { id: 'monitor', name: '📡 실시간 모니터', icon: '📡' },
            { id: 'analysis', name: '🧠 고급 분석', icon: '🧠' },
            { id: 'clinical', name: '📋 임상 보고서', icon: '📋' },
            { id: 'profile', name: '👤 프로필', icon: '👤' },
            { id: 'education', name: '📚 학습 센터', icon: '📚' },
            { id: 'settings', name: '⚙️ 설정', icon: '⚙️' },
            { id: 'sessions', name: '📝 세션 기록', icon: '📝' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentPage(tab.id)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base whitespace-nowrap ${
                currentPage === tab.id
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )

  const renderDashboard = () => (
    <div>
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
    </div>
  )

  const renderMonitor = () => (
    <div>
      <h2 className="text-3xl font-bold mb-8">📡 실시간 신호 모니터링</h2>
      <RealtimeMonitor eegData={eegData} isRecording={isRecording} />
    </div>
  )

  const renderAnalysis = () => (
    <div>
      <h2 className="text-3xl font-bold mb-8">🧠 고급 신경생리학적 분석</h2>
      <AdvancedAnalytics emotionHistory={emotionHistory} eegData={eegData} />
    </div>
  )

  const renderClinical = () => (
    <div>
      <ClinicalReport 
        emotionHistory={emotionHistory} 
        sessionHistory={sessionHistory}
        userName={userName}
      />
    </div>
  )

  const renderProfile = () => (
    <div>
      <h2 className="text-3xl font-bold mb-8">👤 사용자 프로필</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">개인 정보</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">사용자명</label>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">측정 세션 수</label>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">{sessionHistory.length}회</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">총 측정 시간</label>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">{(sessionHistory.length * 1.5).toFixed(1)}분</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">통계 요약</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="text-lg font-semibold text-blue-800 dark:text-blue-300">가장 자주 나타나는 감정</div>
              <div className="text-2xl mt-2">
                {emotionHistory.length > 0 ? 
                  Object.entries(
                    emotionHistory.reduce((acc, curr) => {
                      acc[curr.emotion] = (acc[curr.emotion] || 0) + 1
                      return acc
                    }, {})
                  ).sort((a, b) => b[1] - a[1])[0][0] : '데이터 없음'
                }
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="text-lg font-semibold text-green-800 dark:text-green-300">평균 신뢰도</div>
              <div className="text-2xl mt-2">
                {emotionHistory.length > 0 ? 
                  (emotionHistory.reduce((acc, curr) => acc + curr.confidence, 0) / emotionHistory.length).toFixed(1) + '%' 
                  : '0%'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEducation = () => (
    <div>
      <h2 className="text-3xl font-bold mb-8">📚 EEG 학습 센터</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          🧠 EEG 기술 이해하기
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* EEG란? */}
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                🔬 EEG (뇌전도)란?
              </h3>
              <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                <strong>Electroencephalography</strong>의 줄임말로, 뇌의 전기적 활동을 측정하는 기술입니다. 
                뇌 신경세포들이 활동할 때 발생하는 미세한 전기신호를 포착하여 실시간으로 뇌 상태를 모니터링할 수 있습니다.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4">
                🎧 EEG 장비 구성
              </h3>
              <ul className="text-green-700 dark:text-green-300 space-y-2">
                <li><strong>• 헤드셋 (전극 캡):</strong> 머리에 착용하는 캡 형태</li>
                <li><strong>• 전극:</strong> 8~256개가 두피에 접촉</li>
                <li><strong>• 전도 젤:</strong> 전기 신호 전달 향상</li>
                <li><strong>• 증폭기:</strong> 미세한 뇌파 신호 증폭</li>
              </ul>
            </div>
          </div>

          {/* 뇌파 주파수 */}
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-4">
                📊 뇌파 주파수 대역
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span><strong>Delta (0.5-4Hz)</strong></span>
                  <span className="text-sm text-purple-600">깊은 잠, 무의식</span>
                </div>
                <div className="flex justify-between items-center">
                  <span><strong>Theta (4-8Hz)</strong></span>
                  <span className="text-sm text-purple-600">명상, 창의적 사고</span>
                </div>
                <div className="flex justify-between items-center">
                  <span><strong>Alpha (8-12Hz)</strong></span>
                  <span className="text-sm text-purple-600">이완 상태, 휴식</span>
                </div>
                <div className="flex justify-between items-center">
                  <span><strong>Beta (12-30Hz)</strong></span>
                  <span className="text-sm text-purple-600">집중, 각성 상태</span>
                </div>
                <div className="flex justify-between items-center">
                  <span><strong>Gamma (30-100Hz)</strong></span>
                  <span className="text-sm text-purple-600">고도 집중, 인지</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-orange-800 dark:text-orange-300 mb-4">
                🏢 주요 EEG 장비 제조사
              </h3>
              <div className="space-y-2 text-orange-700 dark:text-orange-300">
                <div><strong>• OpenBCI:</strong> 오픈소스 뇌-컴퓨터 인터페이스</div>
                <div><strong>• Neuralink:</strong> 일론 머스크의 뇌 임플란트</div>
                <div><strong>• Emotiv EPOC:</strong> 소비자용 EEG 헤드셋</div>
                <div><strong>• 의료용 EEG:</strong> 병원 진단 장비</div>
              </div>
            </div>
          </div>
        </div>

        {/* 활용 분야 */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            🎯 EEG 기술 활용 분야
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg">
              <div className="text-2xl mb-2">🏥</div>
              <div className="font-semibold text-gray-900 dark:text-white">의료 진단</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">간질, 수면장애</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg">
              <div className="text-2xl mb-2">🎮</div>
              <div className="font-semibold text-gray-900 dark:text-white">뇌파 게임</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">마인드 컨트롤</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg">
              <div className="text-2xl mb-2">🧘</div>
              <div className="font-semibold text-gray-900 dark:text-white">명상 훈련</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">스트레스 관리</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-600 rounded-lg">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-semibold text-gray-900 dark:text-white">AI 연구</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">감정 인식</div>
            </div>
          </div>
        </div>

        {/* 기술 한계 */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-3">
            ⚠️ 현재 기술의 한계
          </h3>
          <div className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
            <p>• 신호 잡음 (머리카락, 근육 움직임)</p>
            <p>• 개인차로 인한 정확도 변동</p>
            <p>• 복잡한 감정의 정확한 분류 어려움</p>
            <p>• 실시간 처리를 위한 고성능 하드웨어 필요</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div>
      <h2 className="text-3xl font-bold mb-8">⚙️ 설정</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">EEG 장비 설정</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">샘플링 레이트</label>
              <select className="w-full p-3 border rounded-lg dark:bg-gray-700">
                <option>250 Hz</option>
                <option>500 Hz</option>
                <option>1000 Hz</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">채널 수</label>
              <select className="w-full p-3 border rounded-lg dark:bg-gray-700">
                <option>8 채널</option>
                <option>16 채널</option>
                <option>32 채널</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">필터 설정</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  60Hz 노치 필터
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  0.5-50Hz 밴드패스 필터
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">AI 모델 설정</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">감정 분류 모델</label>
              <select className="w-full p-3 border rounded-lg dark:bg-gray-700">
                <option>TensorFlow.js CNN</option>
                <option>LSTM 순환 신경망</option>
                <option>Transformer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">신뢰도 임계값</label>
              <input type="range" min="0" max="100" defaultValue="70" className="w-full" />
              <div className="text-sm text-gray-600 mt-1">70% 이상일 때 감정 표시</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">업데이트 주기</label>
              <select className="w-full p-3 border rounded-lg dark:bg-gray-700">
                <option>0.5초</option>
                <option>1초</option>
                <option>2초</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSessions = () => (
    <div>
      <h2 className="text-3xl font-bold mb-8">📝 세션 기록</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">측정 세션 목록</h3>
          <button 
            onClick={() => setSessionHistory([])}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            전체 삭제
          </button>
        </div>
        
        {sessionHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            아직 기록된 세션이 없습니다.<br />
            EEG 측정을 시작해보세요!
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sessionHistory.slice().reverse().map((session, index) => (
              <div key={session.id} className="p-4 border rounded-lg dark:border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg">
                      세션 #{sessionHistory.length - index}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {session.timestamp.toLocaleDateString()} {session.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div 
                      className="px-3 py-1 rounded-full text-white font-medium"
                      style={{ backgroundColor: emotionColors[session.emotion] }}
                    >
                      {session.emotion}
                    </div>
                    <div className="text-sm mt-1">{session.confidence.toFixed(1)}% 신뢰도</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                  <div>Alpha: {session.eegData.alpha.toFixed(1)}μV</div>
                  <div>Beta: {session.eegData.beta.toFixed(1)}μV</div>
                  <div>Theta: {session.eegData.theta.toFixed(1)}μV</div>
                  <div>Delta: {session.eegData.delta.toFixed(1)}μV</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return renderDashboard()
      case 'monitor': return renderMonitor()
      case 'analysis': return renderAnalysis()
      case 'clinical': return renderClinical()
      case 'profile': return renderProfile()
      case 'education': return renderEducation()
      case 'settings': return renderSettings()
      case 'sessions': return renderSessions()
      default: return renderDashboard()
    }
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

        {/* 네비게이션 */}
        {renderNavigation()}

        {/* 페이지 콘텐츠 */}
        {renderPage()}

        {/* 푸터 */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>🧠 EEG 감정 인식 AI - Neuralink 기술 기반 뇌-컴퓨터 인터페이스</p>
          <p className="text-sm mt-2">개발자: 이승필 | 최신 신경공학 및 AI 기술 적용</p>
          <p className="text-xs mt-1">※ 본 프로젝트는 교육 및 연구 목적의 시뮬레이션입니다</p>
        </div>
      </div>
    </div>
  )
}

export default App