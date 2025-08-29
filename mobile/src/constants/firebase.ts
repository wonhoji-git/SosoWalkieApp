// Firebase 설정
// Firebase 콘솔에서 가져온 설정값으로 바꿔주세요

export const FIREBASE_CONFIG = {
  // Firebase 프로젝트 설정 - 실제 값으로 바꿔주세요
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefgh"
};

// Firebase 설정 방법:
/*
1. https://console.firebase.google.com/ 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: "soso-walkietalkie" 
4. 웹 앱 추가 → 설정 복사 → 위에 붙여넣기
5. Firestore Database 활성화 (테스트 모드)
6. Storage 활성화 (테스트 모드)
*/