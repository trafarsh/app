import { router } from 'expo-router';
import { Text, type StyleProp, type TextStyle } from 'react-native';

import { useStore } from '@/store';
import { useTheme } from '@/theme';

/** Renders text with tappable @mentions and coloured #hashtags, optionally prefixed by a bold username. */
export function RichText({ text, username, style, numberOfLines }: {
  text: string;
  username?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  const t = useTheme();
  const users = useStore((s) => s.users);
  const parts = text.split(/([@#][\w.]+)/g);

  return (
    <Text style={[{ color: t.text, fontSize: 14, lineHeight: 19 }, style]} numberOfLines={numberOfLines}>
      {username && (
        <Text style={{ fontWeight: '600' }} onPress={() => router.push(`/user/${username}`)}>
          {username}{' '}
        </Text>
      )}
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          const name = part.slice(1).replace(/\.$/, '');
          const exists = users.some((u) => u.username === name);
          return (
            <Text key={i} style={{ color: t.link }} onPress={exists ? () => router.push(`/user/${name}`) : undefined}>
              {part}
            </Text>
          );
        }
        if (part.startsWith('#')) {
          return (
            <Text key={i} style={{ color: t.link }}>
              {part}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
}
