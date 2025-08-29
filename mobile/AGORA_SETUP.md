# 🎙️ Agora.io 실시간 음성 통신 설정 가이드

실제 워키토키 음성 통신을 위해 Agora.io App ID를 설정해야 합니다.

## 📋 1단계: Agora.io 계정 생성

1. **[Agora.io 콘솔](https://console.agora.io/)** 접속
2. **"Sign Up"** 클릭하여 무료 계정 생성
3. 이메일 인증 완료

## 🚀 2단계: 프로젝트 생성

1. **"Create New Project"** 클릭
2. **프로젝트 정보 입력:**
   ```
   Project Name: SosoWalkieTalkie
   Use Case: Social & Entertainment
   Authentication Mechanism: "App ID (Testing Mode)" 선택
   ```
3. **"Create"** 클릭

## 🔑 3단계: App ID 복사

1. 생성된 프로젝트에서 **App ID** 복사
   ```
   예시: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

## ⚙️ 4단계: 앱에 App ID 설정

1. **파일 열기:** `src/constants/agora.ts`
2. **App ID 붙여넣기:**
   ```typescript
   export const AGORA_CONFIG = {
     // 복사한 App ID를 여기에 붙여넣기
     APP_ID: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // ← 여기!
     
     DEFAULT_CHANNEL: 'walkietalkie-channel',
     TOKEN: null,
   } as const;
   ```

## 📱 5단계: 앱 재시작

```bash
# 개발 서버 재시작
npx expo start
```

## 🎉 6단계: 테스트

1. **두 개 이상의 디바이스**에서 앱 실행
2. **PTT 버튼**을 누르고 말하기
3. **다른 디바이스에서 음성** 확인

## 🔧 문제 해결

### 연결 안 됨
- App ID가 올바른지 확인
- 인터넷 연결 상태 확인
- 마이크 권한 허용 여부 확인

### 음성이 안 들림  
- 두 디바이스가 같은 채널에 있는지 확인
- 스피커/이어폰 볼륨 확인
- 디바이스 마이크 설정 확인

### 로그 확인
```bash
# React Native 로그 확인
npx react-native log-android  # Android
npx react-native log-ios      # iOS
```

## 🎯 무료 제한

- **월 10,000분** 무료 사용 가능
- 초과 시 $0.99/1000분
- 개발/테스트용으로는 충분

## 🚀 다음 단계

실시간 음성 통신이 작동하면:
- [ ] 채널 선택 기능 추가
- [ ] 사용자 목록 표시
- [ ] 음성 품질 설정
- [ ] 배경 잡음 제거

---

**문제가 있으면 언제든 물어보세요! 🤝**