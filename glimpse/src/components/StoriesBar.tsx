import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useMe, useStore } from '@/store';
import { useTheme } from '@/theme';
import { pickMedia } from '@/utils/media';

import { Avatar, T } from './ui';

export function StoriesBar() {
  const t = useTheme();
  const me = useMe();
  const stories = useStore((s) => s.stories);
  const users = useStore((s) => s.users);
  const seen = useStore((s) => s.seenStories);
  const addStory = useStore((s) => s.addStory);

  const myStory = stories.find((s) => s.userId === me.id);
  const myRing = !myStory ? 'none' : myStory.items.every((i) => seen.includes(i.id)) ? 'seen' : 'unseen';

  const others = useMemo(() => {
    const list = stories
      .filter((s) => s.userId !== me.id && s.items.length > 0)
      .map((s) => ({ story: s, user: users.find((u) => u.id === s.userId)!, allSeen: s.items.every((i) => seen.includes(i.id)) }))
      .filter((x) => x.user);
    // Unseen first, then people you follow.
    return list.sort((a, b) => Number(a.allSeen) - Number(b.allSeen) || Number(me.following.includes(b.user.id)) - Number(me.following.includes(a.user.id)));
  }, [stories, users, seen, me.id, me.following]);

  const add = async () => {
    const media = await pickMedia({ aspect: [9, 16] });
    if (media) addStory(media.uri);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 8, gap: 4 }}>
      <View style={{ alignItems: 'center', width: 84 }}>
        <View>
          <Avatar uri={me.avatar} size={80} ring={myRing} onPress={myStory ? () => router.push(`/story/${me.id}`) : add} />
          <Pressable
            onPress={add}
            hitSlop={6}
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: t.text,
              borderWidth: 3,
              borderColor: t.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="add" size={17} color={t.bg} />
          </Pressable>
        </View>
        <T size={12} muted style={{ marginTop: 5 }} numberOfLines={1}>
          Your story
        </T>
      </View>

      {others.map(({ user, allSeen }) => (
        <Pressable key={user.id} style={{ alignItems: 'center', width: 84 }} onPress={() => router.push(`/story/${user.id}`)}>
          <Avatar uri={user.avatar} size={80} ring={allSeen ? 'seen' : 'unseen'} />
          <T size={12} muted={allSeen} style={{ marginTop: 5, maxWidth: 80 }} numberOfLines={1}>
            {user.username}
          </T>
        </Pressable>
      ))}
    </ScrollView>
  );
}
