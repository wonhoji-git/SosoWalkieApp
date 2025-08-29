# 🎙️ Soso Walkie Talkie Server

실시간 WebSocket 기반 워키토키 서버 for Railway 배포

## 🚀 Railway 배포 방법

### 1. GitHub 연결
1. 이 폴더를 GitHub 레포지토리로 업로드
2. Railway.app 가입 후 로그인
3. "Deploy from GitHub repo" 선택

### 2. 자동 배포
- Railway가 자동으로 `package.json` 감지
- `npm start` 명령어로 서버 시작
- WebSocket 서버가 Railway 도메인에서 실행

### 3. 환경 설정
- PORT: Railway에서 자동 할당
- WebSocket 압축 활성화
- 실시간 음성 데이터 최적화

## 📱 앱 연결

배포 완료 후 Railway에서 제공하는 도메인을 사용:
```
wss://your-app-name.railway.app
```

## 🌟 특징

- ⚡ 실시간 음성 통신
- 🗜️ 메시지 압축으로 지연 최소화
- 🌍 전 세계 어디서든 접근 가능
- 🔄 자동 재연결 및 사용자 관리
- 📦 Base64 오디오 스트리밍

## 🛠️ 기술 스택

- **Runtime**: Node.js 18+
- **WebSocket**: ws 8.14.2
- **Cloud**: Railway
- **Protocol**: WebSocket with JSON messaging

---

**소소 워키토키** - 초등학생들을 위한 재미있는 실시간 음성 통신 앱 🎯