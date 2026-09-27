import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, type ViewToken } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommentIcon, HeartIcon, MoreIcon, ReelsIcon, ShareIcon } from '@/components/icons';
import { Avatar } from '@/components/ui';
import type { Reel } from '@/data/types';
import { useStore, useUser } from '@/store';
import { formatCount } from '@/utils/format';

export default function Reels() {
  const insets = useSafeAreaInsets();
  const reels = useStore((s) => s.reels);
  const { start } = useLocalSearchParams<{ start?: string }>();
  const [height, setHeight] = useState(0);
  const startIndex = start ? Math.max(0, reels.findIndex((r) => r.id === start)) : 0;
  // The active reel is tracked per "start" so opening a different reel resets it.
  const [view, setView] = useState({ start, index: startIndex });
  const active = view.start === start ? view.index : startIndex;
  const [focused, setFocused] = useState(true);
  const [muted, setMuted] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  const onViewable = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<Reel>[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) setView({ start, index: first.index });
    },
    [start],
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      {height > 0 && (
        <FlatList
          // Remount when opened on a different reel so initialScrollIndex applies.
          key={start ?? 'all'}
          data={reels}
          initialScrollIndex={startIndex}
          keyExtractor={(r) => r.id}
          pagingEnabled
          snapToInterval={height}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          onViewableItemsChanged={onViewable}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          windowSize={3}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          renderItem={({ item, index }) => (
            <ReelItem
              reel={item}
              height={height}
              active={focused && index === active}
              near={Math.abs(index - active) <= 1}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
            />
          )}
        />
      )}
      <View style={[styles.top, { top: insets.top + 8 }]} pointerEvents="box-none">
        <Text style={styles.title}>Reels</Text>
        <Pressable hitSlop={10} onPress={() => router.push('/create')}>
          <Ionicons name="camera-outline" size={28} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const ReelItem = memo(function ReelItem({ reel, height, active, near, muted, onToggleMute }: {
  reel: Reel;
  height: number;
  active: boolean;
  near: boolean;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const author = useUser(reel.userId);
  const meId = useStore((s) => s.currentUserId)!;
  const following = useStore((s) => s.users.find((u) => u.id === s.currentUserId)?.following.includes(reel.userId));
  const toggleReelLike = useStore((s) => s.toggleReelLike);
  const toggleFollow = useStore((s) => s.toggleFollow);
  const liked = reel.likes.includes(meId);
  const [expanded, setExpanded] = useState(false);

  const player = useVideoPlayer(near ? reel.video : null, (p) => {
    p.loop = true;
  });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  useEffect(() => {
    // expo-video players are configured by assigning properties.
    // eslint-disable-next-line react-hooks/immutability
    player.muted = muted;
  }, [player, muted]);

  useEffect(() => {
    if (active) player.play();
    else player.pause();
  }, [player, active, status]);

  /* double tap heart / tap to mute */
  const heart = useSharedValue(0);
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heart.get() }], opacity: heart.get() > 0.05 ? 1 : 0 }));
  const lastTap = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [muteHint, setMuteHint] = useState(false);

  const onPress = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      if (tapTimer.current) clearTimeout(tapTimer.current);
      if (!liked) toggleReelLike(reel.id);
      heart.set(withSequence(withSpring(1.1, { damping: 8 }), withTiming(1, { duration: 100 }), withDelay(450, withTiming(0, { duration: 180 }))));
    } else {
      tapTimer.current = setTimeout(() => {
        onToggleMute();
        setMuteHint(true);
        setTimeout(() => setMuteHint(false), 800);
      }, 290);
    }
    lastTap.current = now;
  };

  const likeCount = reel.baseLikes + reel.likes.length;
  const showPoster = !isPlaying || status !== 'readyToPlay';

  const caption = useMemo(() => (expanded || reel.caption.length < 60 ? reel.caption : `${reel.caption.slice(0, 55)}…`), [expanded, reel.caption]);

  if (!author) return null;

  return (
    <View style={{ height, backgroundColor: '#000' }}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onPress}>
        <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
        {showPoster && <Image source={{ uri: reel.poster }} style={StyleSheet.absoluteFill} contentFit="cover" />}
      </Pressable>

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.center, heartStyle]}>
        <HeartIcon filled size={110} color="#fff" />
      </Animated.View>
      {muteHint && (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.center]}>
          <View style={styles.muteBubble}>
            <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={26} color="#fff" />
          </View>
        </View>
      )}

      {/* right rail */}
      <View style={styles.rail}>
        <RailButton label={formatCount(likeCount)} onPress={() => toggleReelLike(reel.id)}>
          <HeartIcon filled={liked} color={liked ? '#FF3040' : '#fff'} size={28} />
        </RailButton>
        <RailButton label={formatCount(reel.comments.length)} onPress={() => router.push({ pathname: '/comments/[id]', params: { id: reel.id, kind: 'reel' } })}>
          <CommentIcon color="#fff" size={28} />
        </RailButton>
        <RailButton label="Share" onPress={() => {}}>
          <ShareIcon color="#fff" size={28} />
        </RailButton>
        <RailButton onPress={() => {}}>
          <MoreIcon color="#fff" size={22} />
        </RailButton>
        <Image source={{ uri: author.avatar }} style={styles.audioThumb} />
      </View>

      {/* bottom info */}
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Avatar uri={author.avatar} size={32} onPress={() => router.push(`/user/${author.username}`)} />
          <Text style={styles.username} onPress={() => router.push(`/user/${author.username}`)}>
            {author.username}
          </Text>
          {author.id !== meId && (
            <Pressable onPress={() => toggleFollow(author.id)} style={styles.followBtn}>
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>{following ? 'Following' : 'Follow'}</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.caption} onPress={() => setExpanded((e) => !e)}>
          {caption}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <Ionicons name="musical-notes" size={13} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 13 }} numberOfLines={1}>
            {reel.audio}
          </Text>
        </View>
      </View>

      {!near && <View style={StyleSheet.absoluteFill} />}
      {status === 'error' && (
        <View style={styles.errorBadge} pointerEvents="none">
          <ReelsIcon color="#fff" size={14} />
          <Text style={{ color: '#fff', fontSize: 11 }}>Video unavailable</Text>
        </View>
      )}
    </View>
  );
});

function RailButton({ children, label, onPress }: { children: React.ReactNode; label?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ alignItems: 'center', gap: 4 }}>
      {children}
      {label !== undefined && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>{label}</Text>}
    </Pressable>
  );
}

const shadow = { textShadowColor: 'rgba(0,0,0,0.35)', textShadowRadius: 4 };

const styles = StyleSheet.create({
  top: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', ...shadow },
  center: { alignItems: 'center', justifyContent: 'center' },
  rail: { position: 'absolute', right: 12, bottom: 24, alignItems: 'center', gap: 22 },
  audioThumb: { width: 30, height: 30, borderRadius: 7, borderWidth: 2, borderColor: '#fff' },
  info: { position: 'absolute', left: 14, right: 80, bottom: 22 },
  username: { color: '#fff', fontWeight: '600', fontSize: 14, ...shadow },
  followBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  caption: { color: '#fff', fontSize: 14, marginTop: 10, lineHeight: 19, ...shadow },
  muteBubble: { backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 40, padding: 16 },
  errorBadge: { position: 'absolute', top: 70, alignSelf: 'center', flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
});
