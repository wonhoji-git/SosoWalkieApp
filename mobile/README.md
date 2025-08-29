# 🐰 소소 워키토키 (Soso WalkieTalkie)

초등학생 친구들을 위한 재미있고 귀여운 모바일 워키토키 앱

## 📱 프로젝트 소개

소소 워키토키는 초등학생들이 재미있게 실시간으로 음성 대화를 나눌 수 있는 모바일 앱입니다. 전통적인 워키토키의 재미를 모바일 환경에서 구현하여 친구들과 언제 어디서나 소통할 수 있습니다.

### 주요 특징
- 🎙️ **Push-to-Talk (PTT)** 방식의 직관적인 음성 통신
- 🎨 **귀여운 동물 캐릭터** 기반 UI/UX
- 🎮 **재미있는 게임 요소** 및 캐릭터 시스템
- 🎆 **이모지 및 스티커** 전송 기능
- 🎵 **다양한 효과음** 및 배경음
- 📱 **크로스 플랫폼** 지원 (iOS & Android)

## 🚀 시작하기

### 사전 요구사항
- Node.js 18.x 이상
- npm 또는 yarn
- Expo CLI
- Android Studio (Android 개발용)
- Xcode (iOS 개발용, macOS만)

### 설치 및 실행

1. **프로젝트 클론**
```bash
git clone [repository-url]
cd SosoWalkieApp
```

2. **의존성 설치**
```bash
npm install
```

3. **개발 서버 시작**
```bash
npx expo start
```

4. **앱 실행**
   - iOS: iOS 시뮬레이터에서 실행하거나 실제 디바이스에서 Expo Go 앱 사용
   - Android: Android 에뮬레이터에서 실행하거나 실제 디바이스에서 Expo Go 앱 사용

## 🛠 기술 스택

### 프론트엔드
- **React Native** with **Expo** - 크로스 플랫폼 개발
- **TypeScript** - 타입 안정성
- **React Navigation** - 화면 네비게이션

### 백엔드 (예정)
- **Firebase**
  - Authentication - 사용자 인증
  - Firestore - 실시간 데이터베이스
  - Cloud Functions - 서버리스 로직

### 실시간 통신 (예정)
- **Agora.io** - 실시간 음성 통신
- **WebRTC** - P2P 음성 연결

## 📁 프로젝트 구조

```
SosoWalkieApp/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   └── PTTButton.tsx    # 푸시 투 톡 버튼
│   ├── screens/             # 화면 컴포넌트
│   │   └── HomeScreen.tsx   # 메인 홈 화면
│   ├── services/            # 서비스 레이어
│   ├── store/               # 상태 관리
│   ├── types/               # TypeScript 타입 정의
│   │   └── index.ts         # 공통 타입
│   ├── utils/               # 유틸리티 함수
│   └── constants/           # 상수 정의
│       └── colors.ts        # 컬러 팔레트
├── assets/                  # 정적 자산
├── App.tsx                  # 앱 진입점
└── package.json
```

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: #FFB6C1 (연한 핑크)
- **Secondary**: #87CEEB (하늘색)
- **Accent**: #98FB98 (연한 초록)
- **White**: #FFFFFF
- **Black**: #333333

### 디자인 컨셉
- 파스텔 톤의 부드러운 색상
- 둥글고 친근한 버튼과 UI 요소
- 귀여운 이모지와 캐릭터 활용

## 🔧 개발 가이드

### 새로운 컴포넌트 추가
```bash
# 컴포넌트 파일 생성
touch src/components/NewComponent.tsx
```

### 새로운 화면 추가
```bash
# 화면 파일 생성
touch src/screens/NewScreen.tsx
```

### 스타일 가이드
- `StyleSheet.create()` 사용
- `constants/colors.ts`에서 색상 참조
- 일관된 네이밍 컨벤션 유지

## 📋 개발 로드맵

### Phase 1: MVP 기본 기능 ✅
- [x] 프로젝트 초기 설정
- [x] 기본 UI 구성
- [x] PTT 버튼 컴포넌트

### Phase 2: 실시간 음성 기능
- [ ] Firebase 연동
- [ ] Agora.io 음성 SDK 통합
- [ ] 실시간 음성 송수신

### Phase 3: 사용자 시스템
- [ ] 사용자 인증
- [ ] 친구 시스템
- [ ] 채널/방 관리

### Phase 4: 재미 요소
- [ ] 캐릭터 선택 시스템
- [ ] 이모지 및 스티커
- [ ] 효과음 추가

### Phase 5: 배포
- [ ] 앱 아이콘 및 스플래시 화면
- [ ] Expo 무료 배포
- [ ] 베타 테스트

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 타입 체크
npx tsc --noEmit
```

## 📦 빌드 및 배포

### 개발 빌드
```bash
npx expo start
```

### Expo 배포
```bash
# Expo 무료 배포
npx expo publish

# 예정: EAS Build (무료 한계 내)
npx eas build --platform all --profile preview
```

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 `LICENSE` 파일을 참고하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안이 있으시면 언제든 연락해주세요!

---

**Made with ❤️ for kids' communication**