export interface User {
  id: string;
  nickname: string;
  character: Character;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface Channel {
  id: string;
  name: string;
  members: User[];
  maxMembers: number;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  type: 'voice' | 'emoji' | 'system';
  content?: string;
  audioUrl?: string;
  emoji?: string;
  sender: User;
  channelId: string;
  timestamp: Date;
}

export interface VoiceState {
  isRecording: boolean;
  isPlaying: boolean;
  duration: number;
  volume: number;
}

export type RootStackParamList = {
  Home: undefined;
  Channel: { channelId: string };
  Settings: undefined;
  Profile: undefined;
};