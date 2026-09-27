import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useScrollToTop } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, IconButton, Screen, SearchBar, T, Username } from '@/components/ui';
import { followerCount, useStore } from '@/store';
import { useTheme } from '@/theme';
import { formatCount } from '@/utils/format';

type Tile = { id: string; image: string; video?: boolean; multi?: boolean; onPress: () => void };

export default function Explore() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const width = Math.min(screenW, 600);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const users = useStore((s) => s.users);
  const posts = useStore((s) => s.posts);
  const reels = useStore((s) => s.reels);
  const meId = useStore((s) => s.currentUserId);
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = users.filter((u) => u.id !== meId);
    if (!q) return list.slice(0, 8);
    return list.filter((u) => u.username.includes(q) || u.name.toLowerCase().includes(q));
  }, [users, query, meId]);

  // Mix posts and reels, then lay them out in blocks of five with one tall tile.
  const tiles: Tile[] = useMemo(() => {
    const p: Tile[] = posts
      .filter((x) => x.userId !== meId)
      .map((x) => ({ id: x.id, image: x.images[0], multi: x.images.length > 1, onPress: () => router.push(`/post/${x.id}`) }));
    const r: Tile[] = reels.map((x) => ({ id: x.id, image: x.poster, video: true, onPress: () => router.push({ pathname: '/reels', params: { start: x.id } }) }));
    const out: Tile[] = [];
    let ri = 0;
    p.forEach((tile, i) => {
      if (i % 4 === 0 && ri < r.length) out.push(r[ri++]);
      out.push(tile);
    });
    return out;
  }, [posts, reels, meId]);

  const cell = (width - 2) / 3;
  const blocks: Tile[][] = [];
  for (let i = 0; i < tiles.length; i += 5) blocks.push(tiles.slice(i, i + 5));

  const renderTile = (tile: Tile | undefined, h: number, slot: string) =>
    tile ? (
      <Pressable key={tile.id} onPress={tile.onPress} style={{ width: cell, height: h }}>
        <Image source={{ uri: tile.image }} style={{ width: '100%', height: '100%', backgroundColor: t.separator }} contentFit="cover" transition={150} />
        {(tile.video || tile.multi) && (
          <Ionicons name={tile.video ? 'play' : 'copy'} size={18} color="#fff" style={{ position: 'absolute', top: 8, right: 8 }} />
        )}
      </Pressable>
    ) : (
      <View key={slot} style={{ width: cell, height: h }} />
    );

  return (
    <Screen>
      <View style={{ paddingTop: insets.top + 6, paddingHorizontal: 14, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {searching && (
          <IconButton
            onPress={() => {
              setSearching(false);
              setQuery('');
              Keyboard.dismiss();
            }}
          >
            <Ionicons name="arrow-back" size={26} color={t.text} />
          </IconButton>
        )}
        <SearchBar value={query} onChangeText={setQuery} onFocus={() => setSearching(true)} style={{ flex: 1 }} placeholder="Search" />
      </View>

      {searching ? (
        <FlatList
          data={results}
          keyExtractor={(u) => u.id}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            !query ? (
              <T weight="700" size={16} style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
                Recent
              </T>
            ) : null
          }
          ListEmptyComponent={
            <T muted style={{ textAlign: 'center', marginTop: 40 }}>
              No results found.
            </T>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/user/${item.username}`)}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: pressed ? t.separator : 'transparent' })}
            >
              <Avatar uri={item.avatar} size={48} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Username name={item.username} verified={item.verified} />
                <T muted size={13} numberOfLines={1}>
                  {item.name} • {formatCount(followerCount(users, item))} followers
                </T>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          <View style={{ width, alignSelf: 'center', gap: 1 }}>
            {blocks.map((b, bi) => {
              const tallRight = bi % 2 === 0;
              const small = [b[0], b[1], b[2], b[3]];
              const tall = b[4];
              const grid = (
                <View style={{ width: cell * 2 + 1, flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>{small.map((x, i) => renderTile(x, cell, `s${bi}-${i}`))}</View>
              );
              return (
                <View key={bi} style={{ flexDirection: 'row', gap: 1 }}>
                  {tallRight ? grid : renderTile(tall, cell * 2 + 1, `t${bi}`)}
                  {tallRight ? renderTile(tall, cell * 2 + 1, `t${bi}`) : grid}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}
