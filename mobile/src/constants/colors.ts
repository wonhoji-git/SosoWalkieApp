export const COLORS = {
  PRIMARY: '#FFB6C1',      // 연한 핑크
  SECONDARY: '#87CEEB',    // 하늘색
  ACCENT: '#98FB98',       // 연한 초록
  WHITE: '#FFFFFF',
  BLACK: '#333333',
  GRAY: '#CCCCCC',
  LIGHT_GRAY: '#F5F5F5',
  DANGER: '#FF6B6B',
  SUCCESS: '#4ECDC4',
} as const;

export const THEME = {
  BORDER_RADIUS: 20,
  SHADOW: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
} as const;