import React, { useState, useEffect } from 'react'
import { Line, Bar, Radar } from 'react-chartjs-2'

const AdvancedAnalytics = ({ emotionHistory, eegData }) => {
  const [spectralAnalysis, setSpectralAnalysis] = useState({})
  const [coherenceData, setCoherenceData] = useState([])
  const [asymmetryIndex, setAsymmetryIndex] = useState(0)

  useEffect(() => {
    if (eegData.length > 0) {
      // 스펙트럴 파워 분석 시뮬레이션
      setSpectralAnalysis({
        delta: { power: Math.random() * 30 + 10, relative: Math.random() * 0.3 + 0.1 },
        theta: { power: Math.random() * 25 + 15, relative: Math.random() * 0.25 + 0.15 },
        alpha: { power: Math.random() * 35 + 20, relative: Math.random() * 0.35 + 0.25 },
        beta: { power: Math.random() * 20 + 10, relative: Math.random() * 0.2 + 0.15 },
        gamma: { power: Math.random() * 15 + 5, relative: Math.random() * 0.15 + 0.05 }
      })

      // 반구간 비대칭성 지수
      setAsymmetryIndex((Math.random() - 0.5) * 2)

      // 코히어런스 데이터
      setCoherenceData([
        { pair: 'F3-F4', coherence: Math.random() * 0.8 + 0.2, frequency: '8-12Hz' },
        { pair: 'C3-C4', coherence: Math.random() * 0.8 + 0.2, frequency: '12-30Hz' },
        { pair: 'P3-P4', coherence: Math.random() * 0.8 + 0.2, frequency: '8-12Hz' },
        { pair: 'Fp1-Fp2', coherence: Math.random() * 0.8 + 0.2, frequency: '4-8Hz' }
      ])
    }
  }, [eegData])

  const spectralChart = {
    labels: ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma'],
    datasets: [{
      label: '절대 파워 (μV²)',
      data: Object.values(spectralAnalysis).map(band => band.power || 0),
      backgroundColor: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'],
      borderColor: ['#dc2626', '#d97706', '#16a34a', '#2563eb', '#7c3aed'],
      borderWidth: 2
    }]
  }

  const coherenceChart = {
    labels: coherenceData.map(d => d.pair),
    datasets: [{
      label: '코히어런스',
      data: coherenceData.map(d => d.coherence),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2
    }]
  }

  const asymmetryChart = {
    labels: ['전두엽', '중심', '두정엽', '후두엽'],
    datasets: [{
      label: '좌뇌 활성도',
      data: [0.7, 0.8, 0.6, 0.9],
      backgroundColor: 'rgba(34, 197, 94, 0.6)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 2
    }, {
      label: '우뇌 활성도',
      data: [0.9, 0.7, 0.8, 0.6],
      backgroundColor: 'rgba(239, 68, 68, 0.6)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 2
    }]
  }

  const getAsymmetryInterpretation = () => {
    if (asymmetryIndex > 0.3) return { text: '우뇌 우세 - 창의적 사고 활성', color: 'text-purple-600' }
    if (asymmetryIndex < -0.3) return { text: '좌뇌 우세 - 논리적 사고 활성', color: 'text-blue-600' }
    return { text: '균형된 뇌활성도', color: 'text-green-600' }
  }

  return (
    <div className="space-y-8">
      {/* 고급 뇌파 분석 대시보드 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          🧠 고급 신경생리학적 분석
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 스펙트럴 파워 분석 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-4">스펙트럴 파워 분석</h4>
            <div className="h-64">
              <Bar data={spectralChart} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: '주파수 대역별 절대 파워' }
                },
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: 'Power (μV²)' } }
                }
              }} />
            </div>
          </div>

          {/* 반구간 비대칭성 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-4">좌우뇌 활성도</h4>
            <div className="h-64">
              <Radar data={asymmetryChart} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: { display: true, text: '뇌 영역별 활성도' }
                },
                scales: {
                  r: { beginAtZero: true, max: 1 }
                }
              }} />
            </div>
          </div>

          {/* 코히어런스 분석 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-4">뇌 영역간 연결성</h4>
            <div className="h-64">
              <Bar data={coherenceChart} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: '코히어런스 분석' }
                },
                scales: {
                  y: { beginAtZero: true, max: 1, title: { display: true, text: 'Coherence' } }
                }
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* 임상 지표 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h4 className="text-xl font-bold mb-4">📊 임상 지표</h4>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">비대칭성 지수 (AI)</span>
                <span className={`font-bold ${getAsymmetryInterpretation().color}`}>
                  {asymmetryIndex.toFixed(3)}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {getAsymmetryInterpretation().text}
              </div>
            </div>

            <div className="p-4 border rounded-lg dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Alpha/Beta 비율</span>
                <span className="font-bold text-blue-600">
                  {spectralAnalysis.alpha && spectralAnalysis.beta ? 
                    (spectralAnalysis.alpha.power / spectralAnalysis.beta.power).toFixed(2) : 'N/A'}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                이완 vs 각성 상태 지표
              </div>
            </div>

            <div className="p-4 border rounded-lg dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Theta/Beta 비율</span>
                <span className="font-bold text-purple-600">
                  {spectralAnalysis.theta && spectralAnalysis.beta ? 
                    (spectralAnalysis.theta.power / spectralAnalysis.beta.power).toFixed(2) : 'N/A'}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                주의력 결핍 관련 지표
              </div>
            </div>

            <div className="p-4 border rounded-lg dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">전체 스펙트럴 파워</span>
                <span className="font-bold text-green-600">
                  {Object.values(spectralAnalysis).reduce((sum, band) => sum + (band.power || 0), 0).toFixed(1)} μV²
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                총 뇌활성도 수준
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h4 className="text-xl font-bold mb-4">🔬 신경마커 분석</h4>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">인지 부하</h5>
              <div className="flex justify-between items-center">
                <span>현재 수준:</span>
                <span className="font-bold">
                  {spectralAnalysis.beta ? 
                    (spectralAnalysis.beta.relative > 0.25 ? '높음' : 
                     spectralAnalysis.beta.relative > 0.15 ? '중간' : '낮음') : 'N/A'}
                </span>
              </div>
              <div className="text-sm mt-2 text-blue-700 dark:text-blue-300">
                Beta파 상대 파워 기반 분석
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <h5 className="font-semibold text-green-800 dark:text-green-300 mb-2">명상/이완 상태</h5>
              <div className="flex justify-between items-center">
                <span>현재 수준:</span>
                <span className="font-bold">
                  {spectralAnalysis.alpha ? 
                    (spectralAnalysis.alpha.relative > 0.3 ? '깊은 이완' : 
                     spectralAnalysis.alpha.relative > 0.2 ? '이완' : '긴장') : 'N/A'}
                </span>
              </div>
              <div className="text-sm mt-2 text-green-700 dark:text-green-300">
                Alpha파 상대 파워 기반 분석
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <h5 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">창의적 사고</h5>
              <div className="flex justify-between items-center">
                <span>현재 수준:</span>
                <span className="font-bold">
                  {spectralAnalysis.theta ? 
                    (spectralAnalysis.theta.relative > 0.2 ? '활발' : 
                     spectralAnalysis.theta.relative > 0.15 ? '보통' : '낮음') : 'N/A'}
                </span>
              </div>
              <div className="text-sm mt-2 text-purple-700 dark:text-purple-300">
                Theta파 상대 파워 기반 분석
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <h5 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">수면/회복</h5>
              <div className="flex justify-between items-center">
                <span>현재 수준:</span>
                <span className="font-bold">
                  {spectralAnalysis.delta ? 
                    (spectralAnalysis.delta.relative > 0.25 ? '높음' : 
                     spectralAnalysis.delta.relative > 0.15 ? '보통' : '낮음') : 'N/A'}
                </span>
              </div>
              <div className="text-sm mt-2 text-yellow-700 dark:text-yellow-300">
                Delta파 상대 파워 기반 분석
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedAnalytics