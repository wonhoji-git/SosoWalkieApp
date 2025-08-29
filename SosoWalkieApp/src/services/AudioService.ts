import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export interface AudioStreamCallbacks {
  onAudioChunk: (audioData: string) => void;
  onRecordingComplete: (audioUri: string) => void;
  onPlaybackComplete: () => void;
  onError: (error: string) => void;
}

export class AudioService {
  private recording?: Audio.Recording;
  private sound?: Audio.Sound;
  private isRecording = false;
  private isPlaying = false;
  private callbacks?: AudioStreamCallbacks;
  private recordingChunks: string[] = [];

  constructor() {
    this.setupAudio();
  }

  setCallbacks(callbacks: AudioStreamCallbacks) {
    this.callbacks = callbacks;
  }

  private async setupAudio() {
    try {
      // 간단한 오디오 모드 설정 (호환성 우선)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      console.log('✅ 오디오 설정 완료');
    } catch (error) {
      console.error('❌ 오디오 설정 실패:', error);
      // 오류가 있어도 계속 진행 - 기본 설정으로도 녹음 가능
      console.log('⚠️ 기본 오디오 설정으로 계속 진행합니다');
    }
  }

  // 마이크 권한 요청
  async requestPermissions(): Promise<boolean> {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        console.error('❌ 마이크 권한이 필요합니다');
        return false;
      }
      console.log('✅ 마이크 권한 획득');
      return true;
    } catch (error) {
      console.error('❌ 권한 요청 실패:', error);
      return false;
    }
  }

  // 녹음 시작
  async startRecording(): Promise<boolean> {
    try {
      if (this.isRecording) {
        console.log('⚠️ 이미 녹음 중입니다');
        return false;
      }

      // 권한 확인
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      // 기존 녹음 정리
      if (this.recording) {
        await this.recording.unloadAsync();
        this.recording = undefined;
      }

      // 새 녹음 시작
      this.recording = new Audio.Recording();
      
      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 22050, // 낮은 샘플레이트로 파일 크기 감소
          numberOfChannels: 1, // 모노 채널로 변경 (50% 크기 감소)
          bitRate: 64000, // 비트레이트 절반으로 감소
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM, // MEDIUM 품질로 변경
          sampleRate: 22050, // 낮은 샘플레이트
          numberOfChannels: 1, // 모노 채널
          bitRate: 64000, // 낮은 비트레이트
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 64000, // 웹에서도 낮은 비트레이트
        },
      };

      await this.recording.prepareToRecordAsync(recordingOptions);
      await this.recording.startAsync();
      
      this.isRecording = true;
      console.log('🎙️ 녹음 시작됨');
      return true;

    } catch (error) {
      console.error('❌ 녹음 시작 실패:', error);
      this.isRecording = false;
      return false;
    }
  }

  // 녹음 중지 및 파일 반환
  async stopRecording(): Promise<string | null> {
    try {
      if (!this.isRecording || !this.recording) {
        console.log('⚠️ 녹음 중이 아닙니다');
        return null;
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      
      this.isRecording = false;
      this.recording = undefined;
      
      console.log('⏹️ 녹음 완료:', uri);
      
      // 콜백으로 녹음 완료 알림
      if (uri) {
        this.callbacks?.onRecordingComplete(uri);
      }
      
      return uri;

    } catch (error) {
      console.error('❌ 녹음 중지 실패:', error);
      this.callbacks?.onError('녹음 중지에 실패했습니다');
      this.isRecording = false;
      return null;
    }
  }

  // 오디오 파일을 Base64로 인코딩
  async encodeAudioToBase64(uri: string): Promise<string | null> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('📦 오디오 Base64 인코딩 완료 (크기:', base64.length, ')');
      return base64;
      
    } catch (error) {
      console.error('❌ Base64 인코딩 실패:', error);
      this.callbacks?.onError('오디오 인코딩에 실패했습니다');
      return null;
    }
  }

  // Base64 오디오 데이터를 임시 파일로 저장 후 재생
  async playBase64Audio(base64Data: string): Promise<boolean> {
    try {
      if (this.isPlaying) {
        console.log('⚠️ 이미 재생 중입니다');
        return false;
      }

      // 임시 파일 경로 생성
      const tempFilePath = `${FileSystem.cacheDirectory}temp_audio_${Date.now()}.m4a`;
      
      // Base64를 파일로 저장
      await FileSystem.writeAsStringAsync(tempFilePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // 기존 사운드 정리
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      // 사운드 로드 및 재생 (저지연 설정)
      const { sound } = await Audio.Sound.createAsync(
        { uri: tempFilePath },
        { 
          shouldPlay: true, 
          volume: 1.0,
          progressUpdateIntervalMillis: 50, // 더 빈번한 업데이트
          positionMillis: 0
        }
      );
      
      this.sound = sound;
      this.isPlaying = true;

      // 재생 완료 이벤트
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          this.isPlaying = false;
          this.callbacks?.onPlaybackComplete();
          
          // 임시 파일 삭제
          FileSystem.deleteAsync(tempFilePath, { idempotent: true }).catch(() => {});
          
          console.log('🔊 Base64 오디오 재생 완료');
        }
      });

      console.log('🔊 Base64 오디오 재생 시작');
      return true;

    } catch (error) {
      console.error('❌ Base64 오디오 재생 실패:', error);
      this.callbacks?.onError('오디오 재생에 실패했습니다');
      this.isPlaying = false;
      return false;
    }
  }

  // 음성 재생
  async playAudio(uri: string): Promise<boolean> {
    try {
      if (this.isPlaying) {
        console.log('⚠️ 이미 재생 중입니다');
        return false;
      }

      // 기존 사운드 정리
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      // 새 사운드 로드 및 재생
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, volume: 1.0 }
      );
      
      this.sound = sound;
      this.isPlaying = true;

      // 재생 완료 이벤트
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          this.isPlaying = false;
          console.log('🔊 재생 완료');
        }
      });

      console.log('🔊 음성 재생 시작');
      return true;

    } catch (error) {
      console.error('❌ 음성 재생 실패:', error);
      this.isPlaying = false;
      return false;
    }
  }

  // 재생 중지
  async stopPlaying(): Promise<void> {
    try {
      if (this.sound && this.isPlaying) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = undefined;
        this.isPlaying = false;
        console.log('⏹️ 재생 중지');
      }
    } catch (error) {
      console.error('❌ 재생 중지 실패:', error);
    }
  }

  // 현재 상태 확인
  getStatus() {
    return {
      isRecording: this.isRecording,
      isPlaying: this.isPlaying,
    };
  }

  // 리소스 정리
  async cleanup(): Promise<void> {
    try {
      if (this.isRecording && this.recording) {
        await this.recording.stopAndUnloadAsync();
      }
      
      if (this.isPlaying && this.sound) {
        await this.sound.unloadAsync();
      }
      
      this.recording = undefined;
      this.sound = undefined;
      this.isRecording = false;
      this.isPlaying = false;
      
      console.log('🧹 AudioService 정리 완료');
    } catch (error) {
      console.error('❌ 정리 실패:', error);
    }
  }
}