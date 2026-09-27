import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';

import { useTheme } from '@/theme';

export type GridItem = { id: string; image: string; multi?: boolean; video?: boolean; onPress: () => void; overlay?: string };

/** Three-column profile grid (3:4 tiles, 1.5px gutters, like the current app). */
export function PostGrid({ items, ratio = 4 / 3 }: { items: GridItem[]; ratio?: number }) {
  const t = useTheme();
  const { width: screenW } = useWindowDimensions();
  const width = Math.min(screenW, 600);
  const gap = 1.5;
  const size = (width - gap * 2) / 3;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap, width, alignSelf: 'center' }}>
      {items.map((it) => (
        <Pressable key={it.id} onPress={it.onPress} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
          <Image source={{ uri: it.image }} style={{ width: size, height: size * ratio, backgroundColor: t.separator }} contentFit="cover" transition={150} recyclingKey={it.id} />
          {(it.multi || it.video) && (
            <Ionicons
              name={it.video ? 'play' : 'copy'}
              size={18}
              color="#fff"
              style={{ position: 'absolute', top: 8, right: 8, textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 4 }}
            />
          )}
          {it.overlay && (
            <View style={{ position: 'absolute', left: 8, bottom: 6, flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name="play-outline" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 3 }}>{it.overlay}</Text>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}
