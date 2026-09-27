import { Text, type StyleProp, type TextStyle } from 'react-native';

import { useTheme } from '@/theme';

/** The app's script wordmark. */
export function Logo({ size = 34, style }: { size?: number; style?: StyleProp<TextStyle> }) {
  const t = useTheme();
  return (
    <Text
      style={[{ fontFamily: 'GrandHotel_400Regular', fontSize: size, color: t.text, includeFontPadding: false, lineHeight: size * 1.2 }, style]}
    >
      Glimpse
    </Text>
  );
}
