# EEG Emotion Recognition AI

TensorFlow 기반 실시간 뇌파(EEG) 감정 분석 시스템

## Project Status

**Current Version: Prototype / Simulation**

- EEG 하드웨어 시뮬레이션 데이터 사용
- 실제 OpenBCI 하드웨어 연동을 위한 시스템 아키텍처 구현
- 향후 실제 뇌파 데이터 연동 계획

## Features

- Real-time EEG brainwave simulation
- 7 emotion state recognition (Happy, Sad, Angry, Fearful, Surprised, Disgusted, Neutral)
- Real-time brainwave visualization charts
- EEG technology educational content
- OpenBCI headset simulation

## Tech Stack

- React 18 + Vite
- Chart.js (Real-time visualization)
- TensorFlow.js (AI framework)
- Tailwind CSS (Styling)

## EEG Frequency Bands

- **Delta (0.5-4Hz)**: Deep sleep
- **Theta (4-8Hz)**: Meditation, creativity
- **Alpha (8-13Hz)**: Relaxation, focus
- **Beta (13-30Hz)**: Alertness, cognitive activity
- **Gamma (30-100Hz)**: High-level cognition

## Installation

```bash
npm install
npm run dev
```

## Deployment

### Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Local Development

```bash
npm run dev
```

Open http://localhost:5173

## Future Plans

- Integration with actual OpenBCI hardware
- Real EEG data processing
- Advanced emotion classification algorithms
- Cloud data storage and analysis

## Note

This is a prototype/demonstration project for educational and research purposes.
All EEG data in this version is simulated for system architecture validation.

---

Built with React + TensorFlow.js
