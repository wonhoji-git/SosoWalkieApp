import {
  createAgoraRtcEngine,
  IRtcEngine,
  RtcConnection,
  ChannelProfileType,
  ClientRoleType,
  RtcStats,
  ConnectionStateType,
} from 'react-native-agora';
import { AGORA_CONFIG } from '../constants/agora';

export interface AgoraServiceCallbacks {
  onJoinChannelSuccess: (channel: string, uid: number) => void;
  onUserJoined: (uid: number) => void;
  onUserOffline: (uid: number) => void;
  onError: (error: string) => void;
  onConnectionStateChanged: (state: ConnectionStateType) => void;
}

export class AgoraService {
  private engine?: IRtcEngine;
  private isJoined = false;
  private currentChannel?: string;
  private callbacks?: AgoraServiceCallbacks;

  constructor() {
    this.initEngine();
  }

  private async initEngine() {
    try {
      if (AGORA_CONFIG.APP_ID === 'YOUR_AGORA_APP_ID_HERE') {
        console.error('⚠️ Agora App ID가 설정되지 않았습니다!');
        console.error('src/constants/agora.ts 파일에서 APP_ID를 설정해주세요.');
        return;
      }

      this.engine = createAgoraRtcEngine();
      
      await this.engine.initialize({
        appId: AGORA_CONFIG.APP_ID,
      });

      console.log('✅ Agora 엔진 초기화 완료');
      
      // 이벤트 리스너 등록
      this.setupEventListeners();
      
    } catch (error) {
      console.error('❌ Agora 엔진 초기화 실패:', error);
      this.callbacks?.onError('Agora 엔진 초기화 실패');
    }
  }

  private setupEventListeners() {
    if (!this.engine) return;

    this.engine.registerEventHandler({
      onJoinChannelSuccess: (connection: RtcConnection, elapsed: number) => {
        console.log('✅ 채널 입장 성공:', connection.channelId);
        this.isJoined = true;
        this.currentChannel = connection.channelId;
        this.callbacks?.onJoinChannelSuccess(connection.channelId!, connection.localUid!);
      },

      onUserJoined: (connection: RtcConnection, remoteUid: number, elapsed: number) => {
        console.log('👋 사용자 입장:', remoteUid);
        this.callbacks?.onUserJoined(remoteUid);
      },

      onUserOffline: (connection: RtcConnection, remoteUid: number, reason: number) => {
        console.log('👋 사용자 퇴장:', remoteUid);
        this.callbacks?.onUserOffline(remoteUid);
      },

      onError: (err: number, msg: string) => {
        console.error('❌ Agora 오류:', err, msg);
        this.callbacks?.onError(`오류 ${err}: ${msg}`);
      },

      onConnectionStateChanged: (connection: RtcConnection, state: ConnectionStateType, reason: number) => {
        console.log('🔄 연결 상태 변경:', state);
        this.callbacks?.onConnectionStateChanged(state);
      },
    });
  }

  // 콜백 함수 등록
  setCallbacks(callbacks: AgoraServiceCallbacks) {
    this.callbacks = callbacks;
  }

  // 채널 입장
  async joinChannel(channelName: string = AGORA_CONFIG.DEFAULT_CHANNEL): Promise<boolean> {
    if (!this.engine) {
      console.error('❌ Agora 엔진이 초기화되지 않았습니다');
      return false;
    }

    try {
      // 채널 프로필 설정 (실시간 통신용)
      await this.engine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      
      // 클라이언트 역할 설정 (브로드캐스터)
      await this.engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      
      // 채널 입장
      await this.engine.joinChannel(AGORA_CONFIG.TOKEN, channelName, 0, {});
      
      console.log(`🚀 채널 입장 시도: ${channelName}`);
      return true;
      
    } catch (error) {
      console.error('❌ 채널 입장 실패:', error);
      this.callbacks?.onError('채널 입장 실패');
      return false;
    }
  }

  // 채널 퇴장
  async leaveChannel(): Promise<void> {
    if (!this.engine || !this.isJoined) return;

    try {
      await this.engine.leaveChannel();
      this.isJoined = false;
      this.currentChannel = undefined;
      console.log('👋 채널 퇴장 완료');
    } catch (error) {
      console.error('❌ 채널 퇴장 실패:', error);
    }
  }

  // 마이크 ON/OFF
  async setMicrophoneEnabled(enabled: boolean): Promise<void> {
    if (!this.engine) return;

    try {
      await this.engine.enableLocalAudio(enabled);
      console.log(`🎤 마이크 ${enabled ? 'ON' : 'OFF'}`);
    } catch (error) {
      console.error('❌ 마이크 제어 실패:', error);
    }
  }

  // 스피커 ON/OFF
  async setSpeakerEnabled(enabled: boolean): Promise<void> {
    if (!this.engine) return;

    try {
      await this.engine.setEnableSpeakerphone(enabled);
      console.log(`🔊 스피커 ${enabled ? 'ON' : 'OFF'}`);
    } catch (error) {
      console.error('❌ 스피커 제어 실패:', error);
    }
  }

  // 현재 상태 확인
  getConnectionState(): { isJoined: boolean; currentChannel?: string } {
    return {
      isJoined: this.isJoined,
      currentChannel: this.currentChannel,
    };
  }

  // 리소스 정리
  async destroy(): Promise<void> {
    if (this.isJoined) {
      await this.leaveChannel();
    }
    
    if (this.engine) {
      this.engine.unregisterEventHandler();
      this.engine.release();
      this.engine = undefined;
    }
    
    console.log('🧹 Agora 서비스 정리 완료');
  }
}