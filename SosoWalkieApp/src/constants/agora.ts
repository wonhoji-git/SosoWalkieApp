// Agora.io 설정
// 이 값들을 실제 Agora 콘솔에서 가져온 값으로 바꿔주세요

export const AGORA_CONFIG = {
  // Agora 콘솔에서 복사한 App ID를 여기에 입력하세요
  APP_ID: 'd242550e15e44cab8499b0f60337add4',
  
  // 기본 채널 이름 (친구들과 같은 채널명을 사용해야 합니다)
  DEFAULT_CHANNEL: 'walkietalkie-channel',
  
  // 임시 토큰 (프로덕션에서는 서버에서 생성해야 함)
  // 테스트용으로는 null 사용 가능
  TOKEN: null,
} as const;

// 사용 방법 안내:
/*
1. https://console.agora.io/ 에서 계정 생성
2. 새 프로젝트 만들기 (Testing Mode)
3. App ID를 복사해서 위의 APP_ID에 붙여넣기
4. 앱 재시작

예시:
APP_ID: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
*/