import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { PostGrid } from '@/components/PostGrid';
import { EmptyState, Header, Screen } from '@/components/ui';
import { useStore } from '@/store';

export default function Saved() {
  const saved = useStore((s) => s.saved);
  const posts = useStore((s) => s.posts);
  const items = saved
    .map((id) => posts.find((p) => p.id === id))
    .filter((p) => p !== undefined)
    .map((p) => ({ id: p.id, image: p.images[0], multi: p.images.length > 1, onPress: () => router.push(`/post/${p.id}`) }));

  return (
    <Screen>
      <Header title="All posts" />
      <ScrollView>
        {items.length ? (
          <PostGrid items={items} ratio={1} />
        ) : (
          <EmptyState icon="bookmark-outline" title="Save" subtitle="Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved." />
        )}
      </ScrollView>
    </Screen>
  );
}
