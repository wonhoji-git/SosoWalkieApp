# 🎙️ Soso Walkie Talkie

초등학생들을 위한 재미있고 귀여운 실시간 워키토키 앱

## 📁 프로젝트 구조

```
Soso-WalkieTolkie/
├── server/                    # WebSocket 서버 (Railway 배포용)
│   ├── simple-websocket-server.js
│   ├── package.json
│   └── node_modules/
├── mobile/                    # React Native 앱 (Expo)
│   ├── src/
│   │   ├── components/        # PTT 버튼 등
│   │   ├── services/         # WebSocket, Audio 서비스
│   │   ├── screens/          # 메인 화면
│   │   └── config/           # 서버 설정
│   ├── app.json              # Expo 설정
│   ├── App.tsx               # 메인 앱
│   └── package.json
└── README.md
```

## 🚀 시작하기

### 1. 서버 실행 (로컬 테스트)
```bash
cd server
npm install
npm start
```

### 2. 모바일 앱 실행
```bash
cd mobile
npm install
npx expo start
```

## 🌐 프로덕션 배포

### Railway 서버 배포:
1. [Railway.app](https://railway.app) 접속
2. GitHub 연결 후 이 레포지토리 선택
3. `server/` 폴더가 자동 감지되어 배포

### 앱 설정:
```typescript
// mobile/src/config/server.ts
USE_PRODUCTION: true // Railway 서버 사용
```

## 🌟 주요 기능

- 🎙️ **Push-to-Talk** - 버튼을 눌러 음성 전송
- ⚡ **실시간 통신** - 즉시 음성 전달
- 👥 **다중 사용자** - 여러 명 동시 접속
- 🌍 **전 세계 접근** - Railway 클라우드 배포
- 📱 **크로스 플랫폼** - iOS/Android 지원

## 🛠️ 기술 스택

**서버:**
- Node.js + WebSocket
- Railway 클라우드
- 메시지 압축 최적화

**모바일:**
- React Native + Expo
- TypeScript
- Real-time Audio Processing

---

**소소 워키토키** - 친구들과 재미있게 소통하는 워키토키! 🎯✨