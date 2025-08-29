import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, THEME } from '../constants/colors';

interface PTTButtonProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording?: boolean;
  disabled?: boolean;
}

const { width } = Dimensions.get('window');

export const PTTButton: React.FC<PTTButtonProps> = ({
  onStartRecording,
  onStopRecording,
  isRecording = false,
  disabled = false,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (disabled) return;
    
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    
    onStartRecording();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    
    onStopRecording();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.buttonContainer,
          { transform: [{ scale: scaleValue }] },
          isRecording && styles.recordingContainer,
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            isRecording && styles.recordingButton,
            disabled && styles.disabledButton,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>
              {isRecording ? '🎙️' : '📻'}
            </Text>
            <Text style={[
              styles.buttonText,
              isRecording && styles.recordingText,
              disabled && styles.disabledText,
            ]}>
              {isRecording ? '말하는 중...' : '누르고 말해요!'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingLabel}>녹음 중</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 200,
    maxHeight: 200,
    borderRadius: width * 0.3,
    ...THEME.SHADOW,
  },
  recordingContainer: {
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.4,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: width * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.WHITE,
  },
  recordingButton: {
    backgroundColor: COLORS.ACCENT,
  },
  disabledButton: {
    backgroundColor: COLORS.GRAY,
    opacity: 0.6,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  recordingText: {
    color: COLORS.WHITE,
  },
  disabledText: {
    color: COLORS.GRAY,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.DANGER,
    borderRadius: 15,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.WHITE,
    marginRight: 8,
  },
  recordingLabel: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
});