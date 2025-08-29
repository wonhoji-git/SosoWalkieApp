import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  DocumentData 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { FIREBASE_CONFIG } from '../constants/firebase';

export interface VoiceMessage {
  id: string;
  userId: string;
  audioUrl: string;
  duration: number;
  timestamp: Timestamp;
  channelId: string;
}

export interface FirebaseServiceCallbacks {
  onNewMessage: (message: VoiceMessage) => void;
  onError: (error: string) => void;
}

export class FirebaseService {
  private app;
  private db;
  private storage;
  private callbacks?: FirebaseServiceCallbacks;
  private unsubscribe?: () => void;

  constructor() {
    // Firebase 초기화
    this.app = initializeApp(FIREBASE_CONFIG);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
    
    console.log('✅ Firebase 초기화 완료');
  }

  // 콜백 함수 등록
  setCallbacks(callbacks: FirebaseServiceCallbacks) {
    this.callbacks = callbacks;
  }

  // 음성 파일을 Firebase Storage에 업로드
  async uploadAudioFile(uri: string, userId: string): Promise<string | null> {
    try {
      console.log('📤 음성 파일 업로드 시작:', uri);

      // 파일 읽기
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // 파일명 생성 (타임스탬프 + 사용자ID)
      const fileName = `voice_${Date.now()}_${userId}.m4a`;
      const storageRef = ref(this.storage, `voice-messages/${fileName}`);
      
      // 업로드
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      console.log('✅ 업로드 완료:', downloadUrl);
      return downloadUrl;

    } catch (error) {
      console.error('❌ 파일 업로드 실패:', error);
      this.callbacks?.onError('음성 전송에 실패했습니다');
      return null;
    }
  }

  // 음성 메시지를 Firestore에 저장
  async sendVoiceMessage(
    audioUrl: string,
    userId: string,
    duration: number,
    channelId: string = 'default-channel'
  ): Promise<boolean> {
    try {
      const messageData = {
        userId,
        audioUrl,
        duration,
        timestamp: Timestamp.now(),
        channelId,
      };

      await addDoc(collection(this.db, 'voice-messages'), messageData);
      console.log('✅ 메시지 전송 완료');
      return true;

    } catch (error) {
      console.error('❌ 메시지 전송 실패:', error);
      this.callbacks?.onError('메시지 전송에 실패했습니다');
      return false;
    }
  }

  // 실시간 음성 메시지 수신 (채널별)
  subscribeToVoiceMessages(channelId: string = 'default-channel') {
    try {
      // 이전 구독 해제
      if (this.unsubscribe) {
        this.unsubscribe();
      }

      const messagesRef = collection(this.db, 'voice-messages');
      const q = query(
        messagesRef,
        orderBy('timestamp', 'desc')
      );

      this.unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data() as DocumentData;
            
            // 해당 채널의 메시지만 처리
            if (data.channelId === channelId) {
              const message: VoiceMessage = {
                id: change.doc.id,
                userId: data.userId,
                audioUrl: data.audioUrl,
                duration: data.duration,
                timestamp: data.timestamp,
                channelId: data.channelId,
              };

              console.log('📨 새 음성 메시지 수신:', message.id);
              this.callbacks?.onNewMessage(message);
            }
          }
        });
      }, (error) => {
        console.error('❌ 메시지 수신 실패:', error);
        this.callbacks?.onError('메시지 수신에 실패했습니다');
      });

      console.log('👂 음성 메시지 구독 시작:', channelId);

    } catch (error) {
      console.error('❌ 구독 설정 실패:', error);
      this.callbacks?.onError('연결에 실패했습니다');
    }
  }

  // 구독 해제
  unsubscribeFromMessages() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
      console.log('👋 메시지 구독 해제');
    }
  }

  // 전체 워키토키 메시지 전송 프로세스
  async sendWalkieTalkieMessage(
    audioUri: string,
    userId: string,
    duration: number,
    channelId: string = 'default-channel'
  ): Promise<boolean> {
    try {
      console.log('📡 워키토키 메시지 전송 시작...');
      
      // 1단계: 오디오 파일 업로드
      const audioUrl = await this.uploadAudioFile(audioUri, userId);
      if (!audioUrl) {
        return false;
      }

      // 2단계: 메시지 데이터 저장
      const success = await this.sendVoiceMessage(audioUrl, userId, duration, channelId);
      if (success) {
        console.log('🎉 워키토키 메시지 전송 성공!');
      }

      return success;

    } catch (error) {
      console.error('❌ 워키토키 메시지 전송 실패:', error);
      this.callbacks?.onError('메시지 전송에 실패했습니다');
      return false;
    }
  }

  // 리소스 정리
  cleanup() {
    this.unsubscribeFromMessages();
    console.log('🧹 FirebaseService 정리 완료');
  }
}