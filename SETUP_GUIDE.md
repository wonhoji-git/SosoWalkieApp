# 소소 워키토키 개발 환경 설정 가이드

## 🚀 시작하기 전에

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn 패키지 매니저
- Git
- Android Studio (Android 개발용)
- Xcode (iOS 개발용, macOS만)

## 📱 1. Expo CLI 설치

```bash
# Expo CLI 전역 설치
npm install -g @expo/cli

# 설치 확인
expo --version
```

## 🔧 2. 프로젝트 초기화

```bash
# 새 Expo 프로젝트 생성
npx create-expo-app SosoWalkieTalkie --template blank-typescript

# 프로젝트 디렉토리로 이동
cd SosoWalkieTalkie

# 개발 서버 시작
npx expo start
```

## 🔥 3. Firebase 설정

### 3.1 Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com) 방문
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: "soso-walkietalkie"
4. Google Analytics 비활성화 (선택사항)

### 3.2 Firebase SDK 설치
```bash
# Firebase SDK 설치
npm install firebase

# Expo Firebase 플러그인
npx expo install expo-application expo-constants
```

### 3.3 Firebase 구성
```javascript
// firebase.config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Firebase 콘솔에서 복사한 설정 값
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 🎵 4. 실시간 음성 설정 (Agora.io)

### 4.1 Agora 계정 생성
1. [Agora.io](https://www.agora.io) 방문
2. 무료 계정 생성
3. 새 프로젝트 생성
4. App ID 복사

### 4.2 Agora SDK 설치
```bash
# React Native Agora SDK
npm install react-native-agora
```

## 📦 5. 추가 의존성 설치

```bash
# 네비게이션
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context

# UI 라이브러리
npm install react-native-elements react-native-vector-icons
npx expo install react-native-svg

# 상태 관리
npm install @reduxjs/toolkit react-redux

# 오디오 처리
npx expo install expo-av

# 푸시 알림
npx expo install expo-notifications

# 디바이스 정보
npx expo install expo-device expo-constants
```

## 🎨 6. 개발 도구 설정

### 6.1 TypeScript 설정
```json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@screens/*": ["screens/*"],
      "@utils/*": ["utils/*"],
      "@assets/*": ["../assets/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts"]
}
```

### 6.2 ESLint 및 Prettier 설정
```bash
# 개발 의존성 설치
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
```

```json
// .eslintrc.js
module.exports = {
  extends: [
    'expo',
    '@react-native-community',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
```

## 📱 7. 테스트 설정

```bash
# 테스트 라이브러리 설치
npm install -D jest @testing-library/react-native @testing-library/jest-native
```

## 📁 8. 프로젝트 구조

```
SosoWalkieTalkie/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── PTTButton/      # 푸시 투 톡 버튼
│   │   ├── CharacterAvatar/ # 캐릭터 아바타
│   │   └── EmojiSticker/   # 이모지 스티커
│   ├── screens/            # 화면 컴포넌트
│   │   ├── HomeScreen/     # 메인 화면
│   │   ├── ChannelScreen/  # 채널 화면
│   │   └── SettingsScreen/ # 설정 화면
│   ├── services/           # 서비스 레이어
│   │   ├── firebase.ts     # Firebase 서비스
│   │   ├── agora.ts        # Agora 음성 서비스
│   │   └── auth.ts         # 인증 서비스
│   ├── store/              # Redux 스토어
│   │   ├── slices/         # Redux 슬라이스
│   │   └── index.ts        # 스토어 설정
│   ├── types/              # TypeScript 타입 정의
│   ├── utils/              # 유틸리티 함수
│   └── constants/          # 상수 정의
├── assets/                 # 이미지, 폰트 등
│   ├── images/
│   ├── sounds/
│   └── fonts/
├── app.json               # Expo 설정
├── package.json
└── tsconfig.json
```

## 🔄 9. 개발 워크플로우

### 9.1 브랜치 전략
```bash
# 메인 브랜치에서 기능 브랜치 생성
git checkout -b feature/ptt-button

# 작업 완료 후 커밋
git add .
git commit -m "feat: PTT 버튼 기본 기능 구현"

# 메인 브랜치에 머지
git checkout main
git merge feature/ptt-button
```

### 9.2 빌드 및 테스트
```bash
# 개발 빌드
npx expo start

# 프로덕션 빌드 (EAS 사용)
npx eas build --platform android --profile production

# 테스트 실행
npm test

# 타입 체크
npx tsc --noEmit
```

## 📲 10. 배포 준비

### 10.1 EAS 설정
```bash
# EAS CLI 설치
npm install -g @expo/eas-cli

# EAS 로그인
eas login

# 프로젝트 구성
eas build:configure
```

### 10.2 앱 아이콘 및 스플래시 생성
```json
// app.json
{
  "expo": {
    "name": "소소 워키토키",
    "slug": "soso-walkietalkie",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#FFE4E1"
    }
  }
}
```

## ⚠️ 주의사항

1. **환경 변수**: Firebase 설정 등 민감한 정보는 환경 변수로 관리
2. **권한**: 마이크 권한 등 필요한 권한을 app.json에서 설정
3. **최적화**: 이미지 및 오디오 파일 최적화로 앱 크기 최소화
4. **테스트**: 실제 디바이스에서 음성 기능 테스트 필수

## 🚀 다음 단계

1. 기본 프로젝트 생성 및 실행 확인
2. Firebase Authentication 구현
3. 기본 UI 컴포넌트 개발
4. PTT 기능 프로토타입 구현
5. 실제 디바이스에서 테스트