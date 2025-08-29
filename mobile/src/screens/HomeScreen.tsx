import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { PTTButton } from '../components/PTTButton';
import { COLORS } from '../constants/colors';
import { AudioService, AudioStreamCallbacks } from '../services/AudioService';
import { WebSocketService, WebSocketServiceCallbacks } from '../services/WebSocketService';

export const HomeScreen: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentChannel, setCurrentChannel] = useState<string>('우리반 친구들');
  const [lastSpeaker, setLastSpeaker] = useState<string>('');
  const audioService = useRef<AudioService | null>(null);
  const webSocketService = useRef<WebSocketService | null>(null);
  const currentUserId = useRef<string>(`소윤_${Date.now().toString().slice(-4)}`); // 사용자 ID

  // 서비스 초기화
  useEffect(() => {
    initializeServices();
    
    return () => {
      // 컴포넌트 언마운트 시 정리
      if (audioService.current) {
        audioService.current.cleanup();
      }
      if (webSocketService.current) {
        webSocketService.current.disconnect();
      }
    };
  }, []);

  const initializeServices = async () => {
    try {
      console.log('🎙️ 워키토키 초기화 시작...', currentUserId.current);
      
      // AudioService 초기화
      audioService.current = new AudioService();
      
      const audioCallbacks: AudioStreamCallbacks = {
        onAudioChunk: (audioData: string) => {
          // 실시간 오디오 청크 전송
          if (webSocketService.current) {
            webSocketService.current.sendVoiceData(audioData);
          }
        },
        
        onRecordingComplete: async (audioUri: string) => {
          // 녹음 완료 후 Base64로 인코딩하여 전송
          if (audioService.current && webSocketService.current) {
            const base64Audio = await audioService.current.encodeAudioToBase64(audioUri);
            if (base64Audio) {
              webSocketService.current.sendVoiceData(base64Audio);
              console.log('📤 음성 데이터 전송 완료');
            }
          }
        },
        
        onPlaybackComplete: () => {
          console.log('🔊 재생 완료');
        },
        
        onError: (error: string) => {
          console.error('❌ Audio 오류:', error);
          Alert.alert('오디오 오류', error);
        }
      };
      
      audioService.current.setCallbacks(audioCallbacks);
      
      // WebSocketService 초기화
      webSocketService.current = new WebSocketService(currentUserId.current);
      
      const wsCallbacks: WebSocketServiceCallbacks = {
        onUserJoined: (userId: string) => {
          console.log('👋 사용자 입장:', userId);
          setOnlineUsers(prev => {
            if (!prev.includes(userId)) {
              return [...prev, userId];
            }
            return prev;
          });
        },
        
        onUserLeft: (userId: string) => {
          console.log('👋 사용자 퇴장:', userId);
          setOnlineUsers(prev => prev.filter(id => id !== userId));
        },
        
        onVoiceReceived: (userId: string, audioData: string) => {
          console.log('🎙️ 음성 데이터 수신:', userId);
          setLastSpeaker(userId);
          
          // 다른 사용자의 음성 자동 재생
          if (audioService.current && userId !== currentUserId.current) {
            audioService.current.playBase64Audio(audioData);
          }
        },
        
        onUserListUpdate: (users: string[]) => {
          console.log('👥 사용자 목록 업데이트:', users);
          setOnlineUsers(users.filter(user => user !== currentUserId.current));
        },
        
        onConnected: () => {
          console.log('✅ 워키토키 연결 성공!');
          setIsConnected(true);
        },
        
        onDisconnected: () => {
          console.log('❌ 워키토키 연결 해제');
          setIsConnected(false);
        },
        
        onError: (error: string) => {
          console.error('❌ WebSocket 오류:', error);
          Alert.alert('연결 오류', error);
          setIsConnected(false);
        }
      };
      
      webSocketService.current.setCallbacks(wsCallbacks);
      
      // WebSocket 연결
      setTimeout(async () => {
        if (webSocketService.current) {
          await webSocketService.current.connect();
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ 서비스 초기화 실패:', error);
      Alert.alert('초기화 오류', '워키토키 초기화에 실패했습니다.');
    }
  };

  const handleStartRecording = async () => {
    if (!audioService.current || !webSocketService.current || !isConnected) {
      Alert.alert('연결 오류', '워키토키에 연결되지 않았습니다.');
      return;
    }
    
    console.log('🎙️ PTT 시작 - 녹음 시작');
    const success = await audioService.current.startRecording();
    if (success) {
      setIsRecording(true);
      setLastSpeaker(currentUserId.current);
    }
  };

  const handleStopRecording = async () => {
    if (!audioService.current) return;
    
    console.log('🎙️ PTT 종료 - 녹음 종료 및 전송');
    setIsRecording(false);
    
    // 녹음 중지 (자동으로 전송됨)
    await audioService.current.stopRecording();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.PRIMARY}
        barStyle="dark-content"
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>🐰 소소 워키토키</Text>
          <View style={[
            styles.connectionStatus,
            isConnected ? styles.connected : styles.disconnected
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isConnected ? COLORS.SUCCESS : COLORS.DANGER }
            ]} />
            <Text style={styles.statusText}>
              {isConnected ? '연결됨' : '연결 안됨'}
            </Text>
          </View>
        </View>

        {/* 채널 정보 */}
        <View style={styles.channelInfo}>
          <Text style={styles.channelTitle}>📻 우리반 친구들</Text>
          <Text style={styles.channelMembers}>
            온라인: {onlineUsers.length > 0 ? `${onlineUsers.join(', ')} (${onlineUsers.length}명)` : '아직 친구가 없어요'}
          </Text>
          {lastSpeaker && (
            <Text style={styles.lastMessage}>
              최근 대화: {lastSpeaker === currentUserId.current ? '나' : lastSpeaker}님 🎙️
            </Text>
          )}
        </View>

        {/* PTT 버튼 */}
        <PTTButton
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          isRecording={isRecording}
          disabled={!isConnected}
        />

        {/* 사용 가이드 */}
        <View style={styles.guideContainer}>
          <Text style={styles.guideTitle}>💡 사용법</Text>
          <Text style={styles.guideText}>
            버튼을 누르고 있는 동안 말해보세요!{'\n'}
            친구들이 바로 들을 수 있어요 ✨
          </Text>
        </View>

        {/* 재미 요소 */}
        <View style={styles.funSection}>
          <Text style={styles.sectionTitle}>🎮 재미 요소</Text>
          <View style={styles.funGrid}>
            <View style={styles.funItem}>
              <Text style={styles.funIcon}>🐰</Text>
              <Text style={styles.funText}>캐릭터</Text>
            </View>
            <View style={styles.funItem}>
              <Text style={styles.funIcon}>😀</Text>
              <Text style={styles.funText}>이모지</Text>
            </View>
            <View style={styles.funItem}>
              <Text style={styles.funIcon}>🌟</Text>
              <Text style={styles.funText}>스티커</Text>
            </View>
          </View>
        </View>

        {/* 하단 메뉴 */}
        <View style={styles.bottomMenu}>
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>👫</Text>
            <Text style={styles.menuText}>친구들</Text>
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>🎵</Text>
            <Text style={styles.menuText}>효과음</Text>
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>🎪</Text>
            <Text style={styles.menuText}>놀이방</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 10,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  connected: {
    backgroundColor: COLORS.SUCCESS + '20',
  },
  disconnected: {
    backgroundColor: COLORS.DANGER + '20',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.BLACK,
  },
  channelInfo: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  channelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 8,
  },
  channelMembers: {
    fontSize: 14,
    color: COLORS.BLACK,
    opacity: 0.7,
  },
  lastMessage: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontStyle: 'italic',
    marginTop: 4,
  },
  guideContainer: {
    backgroundColor: COLORS.SECONDARY + '20',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    alignItems: 'center',
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 8,
  },
  guideText: {
    fontSize: 14,
    color: COLORS.BLACK,
    textAlign: 'center',
    lineHeight: 20,
  },
  funSection: {
    backgroundColor: COLORS.ACCENT + '20',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 15,
    textAlign: 'center',
  },
  funGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  funItem: {
    alignItems: 'center',
    flex: 1,
  },
  funIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  funText: {
    fontSize: 12,
    color: COLORS.BLACK,
    fontWeight: '600',
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  menuItem: {
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  menuText: {
    fontSize: 12,
    color: COLORS.BLACK,
    fontWeight: '600',
  },
});