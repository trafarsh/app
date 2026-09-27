import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { PostCard } from '@/components/PostCard';
import { EmptyState, Header, Screen, T } from '@/components/ui';
import { useStore } from '@/store';

/** Opens a post, followed by more posts from the same account (like tapping a profile grid tile). */
export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const posts = useStore((s) => s.posts);
  const users = useStore((s) => s.users);

  const post = posts.find((p) => p.id === id);
  const author = users.find((u) => u.id === post?.userId);
  const list = useMemo(() => {
    if (!post) return [];
    const more = posts.filter((p) => p.userId === post.userId && p.id !== post.id).sort((a, b) => b.createdAt - a.createdAt);
    return [post, ...more];
  }, [posts, post]);

  if (!post) {
    return (
      <Screen>
        <Header title="Post" />
        <EmptyState icon="image-outline" title="Post not found" subtitle="It may have been deleted." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        center={
          <View style={{ alignItems: 'center' }}>
            <T muted size={12} weight="600">
              {author?.username.toUpperCase()}
            </T>
            <T weight="700" size={16}>
              Posts
            </T>
          </View>
        }
      />
      <FlatList data={list} keyExtractor={(p) => p.id} renderItem={({ item }) => <PostCard post={item} />} initialNumToRender={2} />
    </Screen>
  );
}
