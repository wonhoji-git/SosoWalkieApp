// 서버 환경 설정
export const SERVER_CONFIG = {
  // Railway 배포 URL (배포 후 업데이트 필요)
  PRODUCTION: 'wss://your-app-name.railway.app',
  
  // 로컬 개발 서버
  DEVELOPMENT: 'ws://192.168.45.133:8081',
  
  // 현재 환경 (true: 프로덕션, false: 로컬)
  USE_PRODUCTION: false, // 배포 후 true로 변경
};

// 현재 서버 URL 반환
export const getCurrentServerUrl = (): string => {
  return SERVER_CONFIG.USE_PRODUCTION 
    ? SERVER_CONFIG.PRODUCTION 
    : SERVER_CONFIG.DEVELOPMENT;
};

console.log('🌐 서버 환경:', SERVER_CONFIG.USE_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('📡 서버 URL:', getCurrentServerUrl());