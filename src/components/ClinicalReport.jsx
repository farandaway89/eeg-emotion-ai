import React, { useState, useEffect } from 'react'

const ClinicalReport = ({ emotionHistory, sessionHistory, userName }) => {
  const [reportData, setReportData] = useState({})
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')

  useEffect(() => {
    generateClinicalReport()
  }, [emotionHistory, sessionHistory, selectedTimeRange])

  const generateClinicalReport = () => {
    const now = new Date()
    const timeRanges = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90
    }
    
    const daysBack = timeRanges[selectedTimeRange]
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))
    
    const filteredSessions = sessionHistory.filter(session => 
      new Date(session.timestamp) >= cutoffDate
    )

    // 감정 분석
    const emotionStats = filteredSessions.reduce((acc, session) => {
      acc[session.emotion] = (acc[session.emotion] || 0) + 1
      return acc
    }, {})

    // 스트레스 레벨 계산
    const stressEmotions = ['화남', '두려움', '혐오']
    const positiveEmotions = ['행복']
    const neutralEmotions = ['중립']
    
    const stressCount = stressEmotions.reduce((sum, emotion) => sum + (emotionStats[emotion] || 0), 0)
    const positiveCount = positiveEmotions.reduce((sum, emotion) => sum + (emotionStats[emotion] || 0), 0)
    const totalSessions = filteredSessions.length

    const stressLevel = totalSessions > 0 ? (stressCount / totalSessions * 100) : 0
    const positiveLevel = totalSessions > 0 ? (positiveCount / totalSessions * 100) : 0

    // 수면 품질 추정 (Delta파 기반)
    const avgDelta = filteredSessions.length > 0 ? 
      filteredSessions.reduce((sum, session) => sum + session.eegData.delta, 0) / filteredSessions.length : 0

    // 인지 부하 추정 (Beta파 기반)
    const avgBeta = filteredSessions.length > 0 ? 
      filteredSessions.reduce((sum, session) => sum + session.eegData.beta, 0) / filteredSessions.length : 0

    // 이완도 추정 (Alpha파 기반)
    const avgAlpha = filteredSessions.length > 0 ? 
      filteredSessions.reduce((sum, session) => sum + session.eegData.alpha, 0) / filteredSessions.length : 0

    setReportData({
      patient: userName,
      reportDate: now.toLocaleDateString(),
      timeRange: selectedTimeRange,
      totalSessions: totalSessions,
      emotionStats,
      stressLevel,
      positiveLevel,
      sleepQuality: Math.min(100, (avgDelta / 30) * 100),
      cognitiveLoad: Math.min(100, (avgBeta / 25) * 100),
      relaxationLevel: Math.min(100, (avgAlpha / 40) * 100),
      recommendations: generateRecommendations(stressLevel, positiveLevel, avgAlpha, avgBeta),
      riskFactors: identifyRiskFactors(stressLevel, avgBeta, filteredSessions)
    })
  }

  const generateRecommendations = (stress, positive, alpha, beta) => {
    const recommendations = []
    
    if (stress > 40) {
      recommendations.push({
        priority: 'high',
        category: '스트레스 관리',
        text: '스트레스 수준이 높습니다. 명상, 요가, 심호흡 연습을 권장합니다.',
        action: '일일 15분 명상 프로그램 시작'
      })
    }
    
    if (positive < 20) {
      recommendations.push({
        priority: 'medium',
        category: '정서 개선',
        text: '긍정적 감정이 부족합니다. 사회활동 증가와 취미활동을 권장합니다.',
        action: '주 3회 이상 사회적 활동 참여'
      })
    }
    
    if (alpha < 25) {
      recommendations.push({
        priority: 'medium',
        category: '이완 훈련',
        text: '이완 상태가 부족합니다. 바이오피드백 훈련을 고려해보세요.',
        action: 'Alpha파 증진을 위한 뉴로피드백 세션'
      })
    }
    
    if (beta > 20) {
      recommendations.push({
        priority: 'low',
        category: '인지 부하',
        text: '인지적 과부하 상태입니다. 충분한 휴식과 수면이 필요합니다.',
        action: '업무 강도 조절 및 휴식 시간 증대'
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'low',
        category: '유지 관리',
        text: '현재 상태가 양호합니다. 현재의 생활 패턴을 유지하세요.',
        action: '정기적인 모니터링 지속'
      })
    }

    return recommendations
  }

  const identifyRiskFactors = (stress, beta, sessions) => {
    const risks = []
    
    if (stress > 60) {
      risks.push({
        level: 'high',
        factor: '만성 스트레스',
        description: '지속적인 높은 스트레스는 심혈관 질환 및 우울증 위험을 증가시킵니다.'
      })
    }
    
    if (beta > 25) {
      risks.push({
        level: 'medium',
        factor: '인지적 과활성',
        description: '지속적인 높은 인지 부하는 번아웃과 주의력 장애를 유발할 수 있습니다.'
      })
    }
    
    if (sessions.length < 5 && selectedTimeRange === '7d') {
      risks.push({
        level: 'low',
        factor: '측정 빈도 부족',
        description: '정확한 분석을 위해 더 빈번한 측정이 필요합니다.'
      })
    }

    return risks
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-300'
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300'
      default: return 'text-blue-600 bg-blue-100 border-blue-300'
    }
  }

  const getRiskColor = (level) => {
    switch(level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-300'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-300'
      default: return 'text-gray-600 bg-gray-50 border-gray-300'
    }
  }

  return (
    <div className="space-y-8">
      {/* 보고서 헤더 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📋 임상 EEG 분석 보고서
            </h2>
            <div className="text-gray-600 dark:text-gray-300">
              <p>환자명: <span className="font-semibold">{reportData.patient}</span></p>
              <p>보고서 생성일: <span className="font-semibold">{reportData.reportDate}</span></p>
              <p>분석 기간: <span className="font-semibold">최근 {selectedTimeRange}</span></p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {['24h', '7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* 핵심 지표 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{reportData.totalSessions || 0}</div>
            <div className="text-sm text-blue-800 dark:text-blue-300">총 측정 세션</div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{(reportData.stressLevel || 0).toFixed(1)}%</div>
            <div className="text-sm text-red-800 dark:text-red-300">스트레스 지수</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{(reportData.relaxationLevel || 0).toFixed(1)}%</div>
            <div className="text-sm text-green-800 dark:text-green-300">이완도</div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{(reportData.cognitiveLoad || 0).toFixed(1)}%</div>
            <div className="text-sm text-purple-800 dark:text-purple-300">인지 부하</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 감정 분포 분석 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">📊 감정 상태 분포</h3>
          
          <div className="space-y-3">
            {Object.entries(reportData.emotionStats || {}).map(([emotion, count]) => {
              const percentage = reportData.totalSessions > 0 ? (count / reportData.totalSessions * 100) : 0
              return (
                <div key={emotion} className="flex items-center justify-between">
                  <span className="font-medium">{emotion}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold mb-2">해석</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {reportData.stressLevel > 30 ? 
                '스트레스 관련 감정(화남, 두려움, 혐오)의 비중이 높습니다. 스트레스 관리가 필요합니다.' :
                reportData.positiveLevel > 30 ?
                '긍정적 감정의 비중이 높아 정서적 안정성이 양호합니다.' :
                '중립적 감정이 주를 이루며, 정서적 변화가 적은 상태입니다.'
              }
            </p>
          </div>
        </div>

        {/* 위험 요소 분석 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">⚠️ 위험 요소 분석</h3>
          
          <div className="space-y-3">
            {(reportData.riskFactors || []).map((risk, index) => (
              <div key={index} className={`p-3 border rounded-lg ${getRiskColor(risk.level)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{risk.factor}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                    {risk.level === 'high' ? '높음' : risk.level === 'medium' ? '중간' : '낮음'}
                  </span>
                </div>
                <p className="text-sm">{risk.description}</p>
              </div>
            ))}
          </div>

          {(!reportData.riskFactors || reportData.riskFactors.length === 0) && (
            <div className="text-center py-8 text-green-600">
              <div className="text-4xl mb-2">✅</div>
              <p>현재 특별한 위험 요소가 발견되지 않았습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 권장사항 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">💡 전문가 권장사항</h3>
        
        <div className="space-y-4">
          {(reportData.recommendations || []).map((rec, index) => (
            <div key={index} className={`p-4 border rounded-lg ${getPriorityColor(rec.priority)}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-semibold">{rec.category}</span>
                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                    {rec.priority === 'high' ? '우선순위 높음' : 
                     rec.priority === 'medium' ? '우선순위 중간' : '우선순위 낮음'}
                  </span>
                </div>
              </div>
              <p className="mb-2">{rec.text}</p>
              <div className="text-sm font-medium">
                🎯 실행 계획: {rec.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 다음 검진 일정 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">📅 후속 조치</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg dark:border-gray-600">
            <h4 className="font-semibold mb-2">단기 (1주일)</h4>
            <ul className="text-sm space-y-1">
              <li>• 일일 스트레스 모니터링</li>
              <li>• 권장 이완법 실시</li>
              <li>• 수면 패턴 기록</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg dark:border-gray-600">
            <h4 className="font-semibold mb-2">중기 (1개월)</h4>
            <ul className="text-sm space-y-1">
              <li>• 종합 재평가 실시</li>
              <li>• 권장사항 이행 점검</li>
              <li>• 필요시 전문의 상담</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg dark:border-gray-600">
            <h4 className="font-semibold mb-2">장기 (3개월)</h4>
            <ul className="text-sm space-y-1">
              <li>• 장기 트렌드 분석</li>
              <li>• 생활습관 개선 효과 평가</li>
              <li>• 치료 계획 재수립</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClinicalReport