import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'

const RealtimeMonitor = ({ eegData, isRecording }) => {
  const [signalQuality, setSignalQuality] = useState({
    fp1: 85, fp2: 92, f3: 88, f4: 90, c3: 87, c4: 89, p3: 91, p4: 86
  })
  const [artifacts, setArtifacts] = useState([])

  useEffect(() => {
    if (isRecording) {
      // 신호 품질 시뮬레이션
      const interval = setInterval(() => {
        setSignalQuality(prev => ({
          fp1: Math.max(70, Math.min(100, prev.fp1 + (Math.random() - 0.5) * 10)),
          fp2: Math.max(70, Math.min(100, prev.fp2 + (Math.random() - 0.5) * 10)),
          f3: Math.max(70, Math.min(100, prev.f3 + (Math.random() - 0.5) * 10)),
          f4: Math.max(70, Math.min(100, prev.f4 + (Math.random() - 0.5) * 10)),
          c3: Math.max(70, Math.min(100, prev.c3 + (Math.random() - 0.5) * 10)),
          c4: Math.max(70, Math.min(100, prev.c4 + (Math.random() - 0.5) * 10)),
          p3: Math.max(70, Math.min(100, prev.p3 + (Math.random() - 0.5) * 10)),
          p4: Math.max(70, Math.min(100, prev.p4 + (Math.random() - 0.5) * 10)),
        }))

        // 아티팩트 감지 시뮬레이션
        if (Math.random() < 0.15) {
          setArtifacts(prev => [
            ...prev.slice(-4),
            {
              id: Date.now(),
              type: ['Eye Blink', 'Muscle Movement', '60Hz Noise', 'Electrode Pop'][Math.floor(Math.random() * 4)],
              channel: ['Fp1', 'Fp2', 'F3', 'F4'][Math.floor(Math.random() * 4)],
              timestamp: new Date().toLocaleTimeString(),
              severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
            }
          ])
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isRecording])

  const getQualityColor = (quality) => {
    if (quality >= 90) return 'text-green-600 bg-green-100'
    if (quality >= 80) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 전극 신호 품질 모니터링 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          📡 전극 신호 품질 모니터링
        </h3>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          {Object.entries(signalQuality).map(([channel, quality]) => (
            <div key={channel} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-1">{channel.toUpperCase()}</div>
              <div className={`px-2 py-1 rounded-lg text-xs font-bold ${getQualityColor(quality)}`}>
                {quality.toFixed(0)}%
              </div>
            </div>
          ))}
        </div>

        {/* 뇌 지도 시각화 */}
        <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center">
          <div className="relative">
            <div className="w-32 h-40 border-2 border-gray-400 rounded-full relative">
              {/* 전극 위치 표시 */}
              <div className="absolute top-2 left-8 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs text-white font-bold">Fp1</div>
              <div className="absolute top-2 right-8 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs text-white font-bold">Fp2</div>
              <div className="absolute top-8 left-4 w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-xs text-white font-bold">F3</div>
              <div className="absolute top-8 right-4 w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-xs text-white font-bold">F4</div>
              <div className="absolute top-16 left-0 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold">C3</div>
              <div className="absolute top-16 right-0 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold">C4</div>
              <div className="absolute bottom-8 left-4 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white font-bold">P3</div>
              <div className="absolute bottom-8 right-4 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white font-bold">P4</div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-300">10-20 국제 전극 배치법</div>
          </div>
        </div>
      </div>

      {/* 실시간 아티팩트 감지 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          ⚠️ 실시간 아티팩트 감지
        </h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {artifacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              현재 감지된 아티팩트가 없습니다
            </div>
          ) : (
            artifacts.slice().reverse().map((artifact) => (
              <div key={artifact.id} className="p-3 border rounded-lg dark:border-gray-600">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{artifact.type}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      채널: {artifact.channel} | {artifact.timestamp}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(artifact.severity)}`}>
                    {artifact.severity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 아티팩트 통계 */}
        <div className="mt-4 pt-4 border-t dark:border-gray-600">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{artifacts.filter(a => a.severity === 'Low').length}</div>
              <div className="text-xs text-gray-600">경미한 수준</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">{artifacts.filter(a => a.severity === 'Medium').length}</div>
              <div className="text-xs text-gray-600">중간 수준</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">{artifacts.filter(a => a.severity === 'High').length}</div>
              <div className="text-xs text-gray-600">심각한 수준</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealtimeMonitor