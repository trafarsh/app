import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SectionList, View } from 'react-native';

import { Avatar, Button, Header, Screen, T } from '@/components/ui';
import type { Notification } from '@/data/types';
import { useMe, useStore } from '@/store';
import { useTheme } from '@/theme';
import { timeShort } from '@/utils/format';

const DAY = 86_400_000;

export default function Activity() {
  const t = useTheme();
  const me = useMe();
  const notifications = useStore((s) => s.notifications);
  const users = useStore((s) => s.users);
  const posts = useStore((s) => s.posts);
  const toggleFollow = useStore((s) => s.toggleFollow);
  const [now] = useState(() => Date.now());

  const sections = useMemo(() => {
    const mine = notifications.filter((n) => n.ownerId === me.id).sort((a, b) => b.createdAt - a.createdAt);
    const groups: { title: string; data: Notification[] }[] = [
      { title: 'Today', data: mine.filter((n) => now - n.createdAt < DAY) },
      { title: 'This week', data: mine.filter((n) => now - n.createdAt >= DAY && now - n.createdAt < 7 * DAY) },
      { title: 'This month', data: mine.filter((n) => now - n.createdAt >= 7 * DAY && now - n.createdAt < 30 * DAY) },
      { title: 'Earlier', data: mine.filter((n) => now - n.createdAt >= 30 * DAY) },
    ];
    return groups.filter((g) => g.data.length > 0);
  }, [notifications, me.id, now]);

  return (
    <Screen>
      <Header title="Notifications" />
      <SectionList
        sections={sections}
        keyExtractor={(n) => n.id}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 }}>
            <T weight="700" size={20}>Activity on your posts</T>
            <T muted style={{ textAlign: 'center', marginTop: 8 }}>
              When someone likes or comments on one of your posts, you&apos;ll see it here.
            </T>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <T weight="700" size={16} style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
            {section.title}
          </T>
        )}
        renderItem={({ item }) => {
          const u = users.find((x) => x.id === item.userId);
          if (!u) return null;
          const post = item.postId ? posts.find((p) => p.id === item.postId) : undefined;
          const following = me.following.includes(u.id);
          const verb =
            item.type === 'like'
              ? 'liked your photo.'
              : item.type === 'follow'
                ? 'started following you.'
                : item.type === 'comment'
                  ? `commented: ${item.text}`
                  : `mentioned you in a comment: ${item.text}`;
          return (
            <Pressable
              onPress={() => (post ? router.push(`/post/${post.id}`) : router.push(`/user/${u.username}`))}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: pressed ? t.separator : 'transparent' })}
            >
              <Avatar uri={u.avatar} size={44} onPress={() => router.push(`/user/${u.username}`)} />
              <T style={{ flex: 1, marginHorizontal: 12 }} size={14}>
                <T weight="600">{u.username}</T> {verb} <T muted>{timeShort(item.createdAt)}</T>
              </T>
              {item.type === 'follow' ? (
                <Button small variant={following ? 'secondary' : 'primary'} title={following ? 'Following' : 'Follow back'} onPress={() => toggleFollow(u.id)} />
              ) : post ? (
                <Image source={{ uri: post.images[0] }} style={{ width: 44, height: 44, borderRadius: 4, backgroundColor: t.separator }} />
              ) : null}
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}
