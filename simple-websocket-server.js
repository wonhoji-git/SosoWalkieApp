// 간단한 WebSocket 서버 (Node.js)
const WebSocket = require('ws');

// Railway 환경에서는 PORT 환경변수 사용
const PORT = process.env.PORT || 8081;

const wss = new WebSocket.Server({ 
  port: PORT,
  perMessageDeflate: true, // 메시지 압축 활성화
  maxPayload: 10 * 1024 * 1024, // 10MB 최대 페이로드 (큰 음성파일 지원)
});
const clients = new Map();

console.log(`🚀 워키토키 서버 시작됨: PORT ${PORT}`);
console.log('🌍 Railway 배포 완료 - 전 세계에서 접근 가능!');
console.log('📱 어디서든 워키토키 사용 가능!');

wss.on('connection', function connection(ws) {
  const userId = `User_${Date.now()}`;
  clients.set(ws, userId);
  
  console.log(`👋 ${userId} 연결됨 (총 ${clients.size}명)`);
  
  // 새 사용자 입장 알림
  broadcastToOthers(ws, {
    type: 'join',
    userId: userId,
    timestamp: Date.now()
  });
  
  // 현재 사용자 목록 전송
  const userList = Array.from(clients.values());
  broadcast({
    type: 'user_list',
    users: userList,
    timestamp: Date.now()
  });

  ws.on('message', function message(data) {
    try {
      const packet = JSON.parse(data);
      console.log(`📨 ${userId}: ${packet.type}`);
      
      if (packet.type === 'voice') {
        const dataSize = packet.data?.length || 0;
        console.log(`🎙️ ${userId} 음성 전송 (Base64 크기: ${dataSize})`);
        
        // 음성 데이터만 즉시 전달 (우선순위 처리)
        broadcastToOthers(ws, packet);
        return; // 다른 처리 건너뛰고 즉시 전송
      }
      
      // 다른 메시지는 일반적으로 처리
      broadcastToOthers(ws, packet);
      
    } catch (error) {
      console.error('❌ 메시지 파싱 오류:', error);
    }
  });

  ws.on('close', function close() {
    const userId = clients.get(ws);
    clients.delete(ws);
    console.log(`👋 ${userId} 연결 해제됨 (남은 인원: ${clients.size}명)`);
    
    // 퇴장 알림
    broadcastToOthers(ws, {
      type: 'leave',
      userId: userId,
      timestamp: Date.now()
    });
  });

  ws.on('error', function error(err) {
    console.error('❌ WebSocket 오류:', err);
  });
});

// 특정 클라이언트를 제외하고 모든 클라이언트에게 전송
function broadcastToOthers(senderWs, message) {
  const senderUserId = clients.get(senderWs);
  message.userId = senderUserId;
  
  wss.clients.forEach(function each(client) {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// 모든 클라이언트에게 전송
function broadcast(message) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

console.log('');
console.log('🎙️ Railway 배포 완료!');
console.log('📱 앱에서 프로덕션 서버 URL 사용');
console.log('🌐 전 세계 어디서든 실시간 워키토키!');
console.log('');