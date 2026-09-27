import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { User } from '@/data/types';
import { followerCount, useStore, useStoryRing } from '@/store';
import { useTheme } from '@/theme';
import { formatCount } from '@/utils/format';

import { BackIcon, CreateIcon, ReelsIcon } from './icons';
import { PostGrid, type GridItem } from './PostGrid';
import { RichText } from './RichText';
import { ActionSheet, Avatar, Button, EmptyState, IconButton, T } from './ui';

type Tab = 'posts' | 'reels' | 'tagged';

export function ProfileView({ user, isMe }: { user: User; isMe: boolean }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const users = useStore((s) => s.users);
  const allPosts = useStore((s) => s.posts);
  const allReels = useStore((s) => s.reels);
  const me = useStore((s) => s.users.find((u) => u.id === s.currentUserId)!);
  const toggleFollow = useStore((s) => s.toggleFollow);
  const chatWith = useStore((s) => s.chatWith);
  const ring = useStoryRing(user.id);
  const [tab, setTab] = useState<Tab>('posts');
  const [unfollowOpen, setUnfollowOpen] = useState(false);

  const posts = useMemo(() => allPosts.filter((p) => p.userId === user.id).sort((a, b) => b.createdAt - a.createdAt), [allPosts, user.id]);
  const reels = useMemo(() => allReels.filter((r) => r.userId === user.id), [allReels, user.id]);
  const tagged = useMemo(
    () => allPosts.filter((p) => p.userId !== user.id && (p.caption.includes(`@${user.username}`) || p.comments.some((c) => c.text.includes(`@${user.username}`)))),
    [allPosts, user.id, user.username],
  );
  const isFollowing = me.following.includes(user.id);
  const followsYou = user.following.includes(me.id);

  const items: GridItem[] =
    tab === 'posts'
      ? posts.map((p) => ({ id: p.id, image: p.images[0], multi: p.images.length > 1, onPress: () => router.push(`/post/${p.id}`) }))
      : tab === 'reels'
        ? reels.map((r) => ({
            id: r.id,
            image: r.poster,
            overlay: formatCount(r.views),
            onPress: () => router.push({ pathname: '/reels', params: { start: r.id } }),
          }))
        : tagged.map((p) => ({ id: p.id, image: p.images[0], onPress: () => router.push(`/post/${p.id}`) }));

  const stat = (value: number, label: string, onPress?: () => void) => (
    <Pressable onPress={onPress} disabled={!onPress} style={{ alignItems: 'flex-start', flex: 1 }}>
      <T weight="700" size={16}>
        {formatCount(value)}
      </T>
      <T size={14}>{label}</T>
    </Pressable>
  );

  const shareProfile = () => Share.share({ message: `Follow ${user.username} on Glimpse: glimpse.app/${user.username}` }).catch(() => {});

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {/* top bar */}
      <View style={{ paddingTop: insets.top }}>
        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }}>
          {!isMe && (
            <IconButton onPress={() => router.back()} style={{ marginRight: 8 }}>
              <BackIcon color={t.text} />
            </IconButton>
          )}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {isMe && <Ionicons name="lock-closed-outline" size={15} color={t.text} />}
            <T weight="700" size={isMe ? 22 : 18} numberOfLines={1}>
              {user.username}
            </T>
            {user.verified && <Ionicons name="checkmark-circle" size={16} color="#0095F6" />}
            {isMe && <Ionicons name="chevron-down" size={16} color={t.text} />}
          </View>
          {isMe ? (
            <View style={{ flexDirection: 'row', gap: 22 }}>
              <IconButton onPress={() => router.push('/create')}>
                <CreateIcon color={t.text} size={27} />
              </IconButton>
              <IconButton onPress={() => router.push('/settings')}>
                <Ionicons name="menu" size={30} color={t.text} />
              </IconButton>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <Ionicons name="notifications-outline" size={25} color={t.text} />
              <Ionicons name="ellipsis-horizontal" size={24} color={t.text} />
            </View>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        <View>
          {/* avatar + stats */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 24 }}>
            <View>
              <Avatar uri={user.avatar} size={90} ring={ring} onPress={ring !== 'none' ? () => router.push(`/story/${user.id}`) : undefined} />
              {isMe && ring === 'none' && (
                <Pressable onPress={() => router.push('/edit-profile')} style={[styles.plus, { backgroundColor: t.text, borderColor: t.bg }]}>
                  <Ionicons name="add" size={16} color={t.bg} />
                </Pressable>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <T weight="600" size={15} style={{ marginBottom: 6 }}>
                {user.name}
              </T>
              <View style={{ flexDirection: 'row' }}>
                {stat(posts.length, 'posts')}
                {stat(followerCount(users, user), 'followers', () => router.push({ pathname: '/follows/[userId]', params: { userId: user.id, tab: 'followers' } }))}
                {stat(user.following.length, 'following', () => router.push({ pathname: '/follows/[userId]', params: { userId: user.id, tab: 'following' } }))}
              </View>
            </View>
          </View>

          {/* bio */}
          <View style={{ paddingHorizontal: 16, paddingTop: 10, gap: 2 }}>
            {user.bio.length > 0 && <RichText text={user.bio} />}
            {user.website && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="link" size={14} color={t.link} style={{ transform: [{ rotate: '-45deg' }] }} />
                <T weight="600" style={{ color: t.link }}>
                  {user.website}
                </T>
              </View>
            )}
            {!isMe && followsYou && (
              <T muted size={13}>
                Follows you
              </T>
            )}
          </View>

          {/* buttons */}
          <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingTop: 14 }}>
            {isMe ? (
              <>
                <Button small variant="secondary" title="Edit profile" style={{ flex: 1 }} onPress={() => router.push('/edit-profile')} />
                <Button small variant="secondary" title="Share profile" style={{ flex: 1 }} onPress={shareProfile} />
              </>
            ) : (
              <>
                <Button
                  small
                  variant={isFollowing ? 'secondary' : 'primary'}
                  title={isFollowing ? 'Following' : followsYou ? 'Follow back' : 'Follow'}
                  style={{ flex: 1 }}
                  icon={isFollowing ? <Ionicons name="chevron-down" size={14} color={t.text} /> : undefined}
                  onPress={() => (isFollowing ? setUnfollowOpen(true) : toggleFollow(user.id))}
                />
                <Button small variant="secondary" title="Message" style={{ flex: 1 }} onPress={() => router.push(`/messages/${chatWith(user.id)}`)} />
              </>
            )}
            <Pressable style={{ backgroundColor: t.button, borderRadius: 8, width: 34, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person-add-outline" size={16} color={t.text} />
            </Pressable>
          </View>

          {/* highlights */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 14, gap: 14 }}>
            {(user.highlights ?? []).map((h) => (
              <View key={h.id} style={{ alignItems: 'center', width: 70 }}>
                <View style={[styles.highlight, { borderColor: t.border }]}>
                  <Image source={{ uri: h.cover }} style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: t.separator }} />
                </View>
                <T size={12} style={{ marginTop: 5 }} numberOfLines={1}>
                  {h.title}
                </T>
              </View>
            ))}
            {isMe && (
              <View style={{ alignItems: 'center', width: 70 }}>
                <View style={[styles.highlight, { borderColor: t.border, alignItems: 'center', justifyContent: 'center' }]}>
                  <Ionicons name="add" size={32} color={t.text} />
                </View>
                <T size={12} style={{ marginTop: 5 }}>
                  New
                </T>
              </View>
            )}
          </ScrollView>
        </View>

        {/* tabs (sticky) */}
        <View style={{ flexDirection: 'row', backgroundColor: t.bg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.border }}>
          {(['posts', 'reels', 'tagged'] as Tab[]).map((k) => {
            const on = tab === k;
            const color = on ? t.text : t.textSecondary;
            return (
              <Pressable key={k} onPress={() => setTab(k)} style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: on ? 1.5 : 0, borderBottomColor: t.text }}>
                {k === 'posts' ? (
                  <Ionicons name="grid-outline" size={23} color={color} />
                ) : k === 'reels' ? (
                  <ReelsIcon color={color} size={24} />
                ) : (
                  <Ionicons name="person-circle-outline" size={27} color={color} />
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={{ minHeight: 400 }}>
          {items.length > 0 ? (
            <PostGrid items={items} ratio={tab === 'reels' ? 16 / 9 : 4 / 3} />
          ) : tab === 'posts' ? (
            isMe ? (
              <View>
                <EmptyState icon="camera-outline" title="Share photos" subtitle="When you share photos, they will appear on your profile." />
                <Button variant="link" title="Share your first photo" onPress={() => router.push('/create')} />
              </View>
            ) : (
              <EmptyState icon="camera-outline" title="No posts yet" />
            )
          ) : tab === 'reels' ? (
            <EmptyState icon="film-outline" title="No reels yet" />
          ) : (
            <EmptyState
              icon="person-circle-outline"
              title={isMe ? 'Photos and videos of you' : 'No photos'}
              subtitle={isMe ? 'When people tag you in photos and videos, they’ll appear here.' : undefined}
            />
          )}
        </View>
      </ScrollView>

      <ActionSheet
        visible={unfollowOpen}
        onClose={() => setUnfollowOpen(false)}
        actions={[
          { label: 'Add to close friends list', icon: 'star-outline', onPress: () => {} },
          { label: 'Mute', icon: 'volume-mute-outline', onPress: () => {} },
          { label: 'Unfollow', icon: 'person-remove-outline', destructive: true, onPress: () => toggleFollow(user.id) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  plus: { position: 'absolute', right: 0, bottom: 0, width: 26, height: 26, borderRadius: 13, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  highlight: { width: 68, height: 68, borderRadius: 34, borderWidth: 1, padding: 3 },
});
