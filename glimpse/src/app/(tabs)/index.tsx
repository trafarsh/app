import { router, useScrollToTop } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeartIcon, MessengerIcon } from '@/components/icons';
import { Logo } from '@/components/Logo';
import { PostCard } from '@/components/PostCard';
import { StoriesBar } from '@/components/StoriesBar';
import { Divider, IconButton, Screen, T } from '@/components/ui';
import { useMe, useStore } from '@/store';
import { useTheme } from '@/theme';

export default function Home() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const posts = useStore((s) => s.posts);
  const unreadChats = useStore((s) => s.chats.filter((c) => c.ownerId === s.currentUserId && c.unread).length);
  const hasActivity = useStore((s) => s.notifications.some((n) => n.ownerId === s.currentUserId));
  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef<FlatList>(null);
  useScrollToTop(listRef);

  // People you follow and your own posts first, then suggested posts.
  const feed = useMemo(() => {
    const mine = new Set([me.id, ...me.following]);
    const byDate = [...posts].sort((a, b) => b.createdAt - a.createdAt);
    return [...byDate.filter((p) => mine.has(p.userId)), ...byDate.filter((p) => !mine.has(p.userId))];
  }, [posts, me.id, me.following]);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <Screen>
      <View style={{ paddingTop: insets.top, backgroundColor: t.bg }}>
        <View style={{ height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }}>
          <Logo size={34} style={{ flex: 1, marginTop: 4 }} />
          <View style={{ flexDirection: 'row', gap: 22, alignItems: 'center' }}>
            <IconButton onPress={() => router.push('/activity')}>
              <HeartIcon color={t.text} />
              {hasActivity && <View style={{ position: 'absolute', right: 0, top: 0, width: 9, height: 9, borderRadius: 5, backgroundColor: t.like, borderWidth: 1.5, borderColor: t.bg }} />}
            </IconButton>
            <IconButton onPress={() => router.push('/messages')}>
              <MessengerIcon color={t.text} />
              {unreadChats > 0 && (
                <View style={{ position: 'absolute', right: -8, top: -6, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: t.like, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 1.5, borderColor: t.bg }}>
                  <T size={11} weight="700" style={{ color: '#fff' }}>
                    {unreadChats}
                  </T>
                </View>
              )}
            </IconButton>
          </View>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={feed}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={
          <>
            <StoriesBar />
            <Divider style={{ marginBottom: 4 }} />
          </>
        }
        ListFooterComponent={
          <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <T weight="700" size={18}>You&apos;re all caught up</T>
            <T muted size={13} style={{ marginTop: 4 }}>You&apos;ve seen all new posts.</T>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={t.textSecondary} />}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        windowSize={7}
      />
    </Screen>
  );
}
