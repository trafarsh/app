import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, useRef, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import type { Post } from '@/data/types';
import { useStore, useStoryRing, useUser } from '@/store';
import { useTheme } from '@/theme';
import { formatCount, timeLong } from '@/utils/format';

import { BookmarkIcon, CommentIcon, HeartIcon, MoreIcon, ShareIcon } from './icons';
import { RichText } from './RichText';
import { ShareSheet } from './ShareSheet';
import { ActionSheet, Avatar, IconButton, T, Username, type SheetAction } from './ui';

export const PostCard = memo(function PostCard({ post }: { post: Post }) {
  const t = useTheme();
  const { width: screenW } = useWindowDimensions();
  const width = Math.min(screenW, 600);
  const author = useUser(post.userId);
  const ring = useStoryRing(post.userId);
  const meId = useStore((s) => s.currentUserId)!;
  const saved = useStore((s) => s.saved.includes(post.id));
  const following = useStore((s) => s.users.find((u) => u.id === s.currentUserId)?.following.includes(post.userId));
  const toggleLike = useStore((s) => s.toggleLike);
  const likePost = useStore((s) => s.likePost);
  const toggleSave = useStore((s) => s.toggleSave);
  const toggleFollow = useStore((s) => s.toggleFollow);
  const deletePost = useStore((s) => s.deletePost);

  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const liked = post.likes.includes(meId);
  const likeCount = post.baseLikes + post.likes.length;
  const height = width / post.aspect;

  /* double tap to like */
  const heartScale = useSharedValue(0);
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.get() }],
    opacity: heartScale.get() > 0.05 ? 1 : 0,
  }));
  const likeScale = useSharedValue(1);
  const likeStyle = useAnimatedStyle(() => ({ transform: [{ scale: likeScale.get() }] }));
  const lastTap = useRef(0);

  const bumpLike = () => {
    likeScale.set(withSequence(withTiming(1.25, { duration: 110 }), withSpring(1)));
  };

  const onImagePress = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      likePost(post.id);
      bumpLike();
      heartScale.set(
        withSequence(
          withSpring(1.1, { damping: 8, stiffness: 220 }),
          withTiming(1, { duration: 100 }),
          withDelay(450, withTiming(0, { duration: 180 })),
        ),
      );
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    lastTap.current = now;
  };

  const onLike = () => {
    toggleLike(post.id);
    if (!liked) bumpLike();
  };

  if (!author) return null;

  const mine = post.userId === meId;
  const actions: SheetAction[] = mine
    ? [
        { label: 'Delete', icon: 'trash-outline', destructive: true, onPress: () => deletePost(post.id) },
        { label: saved ? 'Remove from saved' : 'Save', icon: 'bookmark-outline', onPress: () => toggleSave(post.id) },
      ]
    : [
        { label: saved ? 'Remove from saved' : 'Save', icon: 'bookmark-outline', onPress: () => toggleSave(post.id) },
        { label: 'About this account', icon: 'person-circle-outline', onPress: () => router.push(`/user/${author.username}`) },
        ...(following ? [{ label: 'Unfollow', icon: 'person-remove-outline' as const, onPress: () => toggleFollow(author.id) }] : []),
        { label: 'Report', icon: 'alert-circle-outline', destructive: true, onPress: () => {} },
      ];

  const longCaption = post.caption.length > 80 && !expanded;

  return (
    <View style={{ width, alignSelf: 'center', marginBottom: 14 }}>
      {/* header */}
      <View style={styles.header}>
        <Avatar
          uri={author.avatar}
          size={36}
          ring={ring}
          onPress={() => (ring !== 'none' ? router.push(`/story/${author.id}`) : router.push(`/user/${author.username}`))}
        />
        <Pressable style={{ flex: 1, marginLeft: 10 }} onPress={() => router.push(`/user/${author.username}`)}>
          <Username name={author.username} verified={author.verified} size={14} />
          {post.location && <T size={12}>{post.location}</T>}
        </Pressable>
        {!mine && !following && (
          <Pressable
            onPress={() => toggleFollow(author.id)}
            style={{ borderWidth: 1, borderColor: t.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5, marginRight: 12 }}
          >
            <T weight="600" size={13}>
              Follow
            </T>
          </Pressable>
        )}
        <IconButton onPress={() => setMenuOpen(true)}>
          <MoreIcon color={t.text} />
        </IconButton>
      </View>

      {/* media */}
      <View>
        <FlatList
          data={post.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, i) => `${uri}-${i}`}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          onScroll={Platform.OS === 'web' ? (e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width)) : undefined}
          scrollEventThrottle={32}
          renderItem={({ item }) => (
            <Pressable onPress={onImagePress}>
              <Image source={{ uri: item }} style={{ width, height, backgroundColor: t.separator }} contentFit="cover" transition={200} recyclingKey={item} />
            </Pressable>
          )}
        />
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.center, heartStyle]}>
          <HeartIcon filled size={96} color="#FFFFFF" />
        </Animated.View>
        {post.images.length > 1 && (
          <View style={styles.counter}>
            <T size={12} weight="500" style={{ color: '#fff' }}>
              {index + 1}/{post.images.length}
            </T>
          </View>
        )}
      </View>

      {/* actions */}
      <View style={styles.actions}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 }}>
          <IconButton onPress={onLike}>
            <Animated.View style={likeStyle}>
              <HeartIcon filled={liked} color={liked ? t.like : t.text} />
            </Animated.View>
          </IconButton>
          <IconButton onPress={() => router.push(`/comments/${post.id}`)}>
            <CommentIcon color={t.text} />
          </IconButton>
          <IconButton onPress={() => setShareOpen(true)}>
            <ShareIcon color={t.text} />
          </IconButton>
        </View>
        {post.images.length > 1 && (
          <View style={styles.dots} pointerEvents="none">
            {post.images.map((_, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: i === index ? t.primary : t.border }]} />
            ))}
          </View>
        )}
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <IconButton onPress={() => toggleSave(post.id)}>
            <BookmarkIcon filled={saved} color={t.text} />
          </IconButton>
        </View>
      </View>

      {/* meta */}
      <View style={{ paddingHorizontal: 14, gap: 4 }}>
        {likeCount > 0 && (
          <T weight="600">
            {formatCount(likeCount)} {likeCount === 1 ? 'like' : 'likes'}
          </T>
        )}
        {post.caption.length > 0 && (
          <Pressable onPress={() => setExpanded(true)} disabled={!longCaption}>
            <RichText
              username={author.username}
              text={longCaption ? `${post.caption.slice(0, 70).trimEnd()}… ` : post.caption}
            />
            {longCaption && <T muted>more</T>}
          </Pressable>
        )}
        {post.comments.length > 0 && (
          <T muted onPress={() => router.push(`/comments/${post.id}`)}>
            {post.comments.length === 1 ? 'View 1 comment' : `View all ${post.comments.length} comments`}
          </T>
        )}
        <T muted size={12} style={{ marginTop: 2 }}>
          {timeLong(post.createdAt)}
        </T>
      </View>

      <ShareSheet postId={post.id} visible={shareOpen} onClose={() => setShareOpen(false)} />
      <ActionSheet visible={menuOpen} onClose={() => setMenuOpen(false)} actions={actions} />
    </View>
  );
});

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  center: { alignItems: 'center', justifyContent: 'center' },
  counter: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  actions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  dots: { flexDirection: 'row', gap: 4, position: 'absolute', left: 0, right: 0, justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
