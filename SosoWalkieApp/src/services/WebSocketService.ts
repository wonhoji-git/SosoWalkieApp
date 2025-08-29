import { getCurrentServerUrl } from '../config/server';

export interface VoicePacket {
  type: 'voice' | 'join' | 'leave' | 'user_list';
  userId: string;
  data?: string; // Base64 encoded audio data
  timestamp: number;
  users?: string[];
}

export interface WebSocketServiceCallbacks {
  onUserJoined: (userId: string) => void;
  onUserLeft: (userId: string) => void;
  onVoiceReceived: (userId: string, audioData: string) => void;
  onUserListUpdate: (users: string[]) => void;
  onConnected: () => void;
  onDisconnected: () => void;
  onError: (error: string) => void;
}

export class WebSocketService {
  private ws?: WebSocket;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout?: NodeJS.Timeout;
  private callbacks?: WebSocketServiceCallbacks;
  private currentUserId: string;
  private serverUrl: string;
  private hasDetectedOtherUser = false;

  constructor(userId: string, serverUrl?: string) {
    this.currentUserId = userId;
    this.serverUrl = serverUrl || getCurrentServerUrl();
  }

  setCallbacks(callbacks: WebSocketServiceCallbacks) {
    this.callbacks = callbacks;
  }

  // WebSocket 연결
  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        console.log('🔄 실제 WebSocket 서버 연결 시도:', this.serverUrl);
        
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket 연결 성공');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // 연결 성공 알림
          this.callbacks?.onConnected();
          
          // JSON 형태로 입장 신호 전송
          setTimeout(() => {
            const joinPacket = {
              type: 'join',
              userId: this.currentUserId,
              timestamp: Date.now()
            };
            console.log('📤 입장 신호 전송:', joinPacket);
            this.ws?.send(JSON.stringify(joinPacket));
          }, 500);
          
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          console.log('📥 메시지 수신:', event.data);
          this.handleMessage(event.data);
        };

        this.ws.onclose = () => {
          console.log('❌ WebSocket 연결 종료');
          this.isConnected = false;
          this.callbacks?.onDisconnected();
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket 오류:', error);
          this.callbacks?.onError('연결 오류가 발생했습니다');
          resolve(false);
        };

      } catch (error) {
        console.error('❌ WebSocket 연결 실패:', error);
        this.callbacks?.onError('연결에 실패했습니다');
        resolve(false);
      }
    });
  }

  // 로컬 테스트용 시뮬레이션 (실제 서버 없이 테스트)
  private simulateLocalConnection() {
    console.log('🎭 로컬 시뮬레이션 모드 (테스트용)');
    this.isConnected = true;
    
    // 연결 성공 시뮬레이션
    setTimeout(() => {
      this.callbacks?.onConnected();
      
      // 가상의 다른 사용자들 시뮬레이션
      setTimeout(() => {
        this.callbacks?.onUserJoined('친구1');
        this.callbacks?.onUserListUpdate(['친구1', this.currentUserId]);
      }, 1000);
      
      setTimeout(() => {
        this.callbacks?.onUserJoined('친구2');  
        this.callbacks?.onUserListUpdate(['친구1', '친구2', this.currentUserId]);
      }, 2000);
      
    }, 500);
  }

  // 메시지 처리
  private handleMessage(data: string) {
    try {
      const packet: VoicePacket = JSON.parse(data);
      console.log('📨 JSON 패킷 수신:', packet.type, '보낸이:', packet.userId);
      
      // 자신의 메시지는 무시
      if (packet.userId === this.currentUserId) {
        console.log('🔄 자신의 메시지 무시:', packet.type);
        return;
      }
      
      switch (packet.type) {
        case 'join':
          console.log('👋 새로운 사용자 입장:', packet.userId);
          this.callbacks?.onUserJoined(packet.userId);
          break;
          
        case 'leave':
          console.log('👋 사용자 퇴장:', packet.userId);
          this.callbacks?.onUserLeft(packet.userId);
          break;
          
        case 'user_list':
          console.log('👥 사용자 목록 업데이트:', packet.users);
          if (packet.users) {
            // 자신을 제외한 사용자 목록
            const otherUsers = packet.users.filter(user => user !== this.currentUserId);
            this.callbacks?.onUserListUpdate(otherUsers);
          }
          break;
          
        case 'voice':
          if (packet.data) {
            console.log('🔊 음성 데이터 수신:', packet.userId, '크기:', packet.data.length);
            this.callbacks?.onVoiceReceived(packet.userId, packet.data);
          }
          break;
          
        default:
          console.log('❓ 알 수 없는 메시지 타입:', packet.type);
      }
      
    } catch (error) {
      console.error('❌ 메시지 파싱 실패:', error, 'Raw data:', data.substring(0, 100));
    }
  }

  // 음성 데이터 전송
  sendVoiceData(audioData: string): boolean {
    if (!this.isConnected) {
      console.log('⚠️ 연결되지 않음 - 음성 데이터 무시');
      return false;
    }

    // JSON 패킷으로 전송
    const voicePacket = {
      type: 'voice' as const,
      userId: this.currentUserId,
      data: audioData,
      timestamp: Date.now()
    };
    
    console.log('📤 음성 데이터 전송 - 크기:', audioData.length);
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(voicePacket));
      return true;
    }
    
    return false;
  }

  // 메시지 전송
  private sendMessage(packet: VoicePacket): boolean {
    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(packet));
        return true;
      } else {
        console.log('🎭 로컬 모드: 메시지 시뮬레이션 -', packet.type);
        
        // 로컬 테스트용: 음성 메시지 에코백 시뮬레이션
        if (packet.type === 'voice' && packet.data) {
          setTimeout(() => {
            // 가상의 다른 사용자 응답 시뮬레이션
            this.callbacks?.onVoiceReceived('친구1', packet.data!);
          }, 500);
        }
        
        return true;
      }
    } catch (error) {
      console.error('❌ 메시지 전송 실패:', error);
      return false;
    }
  }

  // 재연결 시도
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ 최대 재연결 시도 횟수 초과');
      this.callbacks?.onError('서버에 연결할 수 없습니다');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 ${delay/1000}초 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // 연결 상태 확인
  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // 연결 종료
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = undefined;
    }

    if (this.ws) {
      // 퇴장 메시지 전송
      this.sendMessage({
        type: 'leave',
        userId: this.currentUserId,
        timestamp: Date.now()
      });

      this.ws.close();
      this.ws = undefined;
    }

    this.isConnected = false;
    console.log('👋 WebSocket 연결 해제');
  }
}