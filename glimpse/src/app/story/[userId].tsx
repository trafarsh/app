import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, KeyboardAvoidingView, PanResponder, Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeartIcon, ShareIcon } from '@/components/icons';
import { Avatar } from '@/components/ui';
import { useStore } from '@/store';
import { timeShort } from '@/utils/format';

const DURATION = 5000;

export default function StoryViewer() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();
  const stories = useStore((s) => s.stories);
  const users = useStore((s) => s.users);
  const seen = useStore((s) => s.seenStories);
  const meId = useStore((s) => s.currentUserId);
  const markStorySeen = useStore((s) => s.markStorySeen);
  const chatWith = useStore((s) => s.chatWith);
  const sendMessage = useStore((s) => s.sendMessage);

  // The queue starts at the tapped user and continues through the other unseen stories.
  const queue = useMemo(() => {
    const withItems = stories.filter((s) => s.items.length > 0);
    const startStory = withItems.find((s) => s.userId === userId);
    const rest = withItems.filter((s) => s.userId !== userId && s.userId !== meId && !s.items.every((i) => seen.includes(i.id)));
    return startStory ? [startStory, ...rest] : rest;
    // Only compute once per opening so marking items seen doesn't reshuffle the queue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const [userIdx, setUserIdx] = useState(0);
  const story = queue[userIdx];
  const [itemIdx, setItemIdx] = useState(() => (story ? Math.max(0, story.items.findIndex((i) => !seen.includes(i.id))) : 0));
  const [paused, setPaused] = useState(false);
  const [reply, setReply] = useState('');
  // Keyed by story item so they reset automatically when the item changes.
  const [likedItem, setLikedItem] = useState<string | null>(null);
  const [sentItem, setSentItem] = useState<string | null>(null);

  const [progress] = useState(() => new Animated.Value(0));
  const [dragY] = useState(() => new Animated.Value(0));

  const item = story?.items[itemIdx];
  const liked = !!item && likedItem === item.id;
  const sent = !!item && sentItem === item.id;

  const close = useCallback(() => (router.canGoBack() ? router.back() : router.replace('/')), []);

  const next = useCallback(() => {
    if (!story) return;
    if (itemIdx < story.items.length - 1) setItemIdx(itemIdx + 1);
    else if (userIdx < queue.length - 1) {
      const nextStory = queue[userIdx + 1];
      setUserIdx(userIdx + 1);
      setItemIdx(Math.max(0, nextStory.items.findIndex((i) => !useStore.getState().seenStories.includes(i.id))));
    } else close();
  }, [story, itemIdx, userIdx, queue, close]);

  const run = useCallback(
    (duration: number) => {
      Animated.timing(progress, { toValue: 1, duration, useNativeDriver: false }).start(({ finished }) => {
        if (finished) next();
      });
    },
    [progress, next],
  );

  const prev = () => {
    if (itemIdx > 0) setItemIdx(itemIdx - 1);
    else if (userIdx > 0) {
      setUserIdx(userIdx - 1);
      setItemIdx(0);
    } else {
      progress.setValue(0);
      run(DURATION);
    }
  };

  // Restart the timer whenever the visible item changes; pause/resume keeps the current position.
  useEffect(() => {
    if (!item) return;
    markStorySeen(item.id);
    progress.setValue(0);
  }, [item, markStorySeen, progress]);

  useEffect(() => {
    if (!item || paused) return;
    progress.stopAnimation((v) => run(DURATION * (1 - Math.min(v, 0.999))));
    return () => progress.stopAnimation();
  }, [item, paused, progress, run]);

  const [pan] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 12 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderGrant: () => setPaused(true),
      onPanResponderMove: (_, g) => dragY.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) close();
        else {
          Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start();
          setPaused(false);
        }
      },
    }),
  );

  if (!story || !item) {
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  const user = users.find((u) => u.id === story.userId);
  const isMine = story.userId === meId;

  const sendReply = () => {
    if (!reply.trim() || !user) return;
    sendMessage(chatWith(user.id), `Replied to your story: ${reply}`);
    setReply('');
    setSentItem(item.id);
    setPaused(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#000' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <Animated.View
        {...pan.panHandlers}
        style={{
          flex: 1,
          paddingTop: insets.top,
          transform: [{ translateY: dragY }, { scale: dragY.interpolate({ inputRange: [0, screenH], outputRange: [1, 0.8], extrapolate: 'clamp' }) }],
        }}
      >
        <View style={styles.media}>
          <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={120} />

          {/* progress bars */}
          <View style={styles.bars}>
            {story.items.map((it, i) => (
              <View key={it.id} style={styles.barTrack}>
                <Animated.View
                  style={[
                    styles.barFill,
                    {
                      width: i < itemIdx ? '100%' : i > itemIdx ? '0%' : progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          {/* header */}
          <View style={styles.header}>
            <Avatar uri={user?.avatar} size={34} onPress={() => { close(); if (user) setTimeout(() => router.push(`/user/${user.username}`), 50); }} />
            <Text style={styles.name}>{isMine ? 'Your story' : user?.username}</Text>
            <Text style={styles.time}>{timeShort(item.createdAt)}</Text>
            <View style={{ flex: 1 }} />
            <Pressable hitSlop={10} onPress={() => setPaused((p) => !p)} style={{ marginRight: 16 }}>
              <Ionicons name={paused ? 'play' : 'pause'} size={22} color="#fff" />
            </Pressable>
            <Pressable hitSlop={10} onPress={close}>
              <Ionicons name="close" size={30} color="#fff" />
            </Pressable>
          </View>

          {/* tap zones */}
          <View style={styles.zones}>
            <Pressable style={{ flex: 1 }} onPress={prev} onLongPress={() => setPaused(true)} onPressOut={() => paused && setPaused(false)} delayLongPress={200} />
            <Pressable style={{ flex: 2 }} onPress={next} onLongPress={() => setPaused(true)} onPressOut={() => paused && setPaused(false)} delayLongPress={200} />
          </View>
        </View>

        {/* footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
          {isMine ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <Ionicons name="eye-outline" size={20} color="#fff" />
              <Text style={{ color: '#fff' }}>Seen by {12 + itemIdx * 7}</Text>
            </View>
          ) : sent ? (
            <Text style={{ color: '#fff', flex: 1, textAlign: 'center', paddingVertical: 12 }}>Sent ✓</Text>
          ) : (
            <>
              <TextInput
                value={reply}
                onChangeText={setReply}
                onFocus={() => setPaused(true)}
                onBlur={() => !reply && setPaused(false)}
                placeholder="Send message"
                placeholderTextColor="rgba(255,255,255,0.85)"
                style={styles.reply}
                returnKeyType="send"
                onSubmitEditing={sendReply}
              />
              <Pressable hitSlop={8} onPress={() => setLikedItem(liked ? null : item.id)}>
                <HeartIcon filled={liked} color={liked ? '#FF3040' : '#fff'} size={28} />
              </Pressable>
              <Pressable hitSlop={8} onPress={sendReply}>
                <ShareIcon color="#fff" size={28} />
              </Pressable>
            </>
          )}
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  media: { flex: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: '#111' },
  bars: { position: 'absolute', top: 8, left: 8, right: 8, flexDirection: 'row', gap: 3 },
  barTrack: { flex: 1, height: 2.5, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)', overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#fff' },
  header: { position: 'absolute', top: 20, left: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 2 },
  name: { color: '#fff', fontWeight: '600', fontSize: 14, textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 3 },
  time: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  zones: { position: 'absolute', left: 0, right: 0, bottom: 0, top: 70, flexDirection: 'row' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 12, paddingTop: 10 },
  reply: { flex: 1, height: 46, borderRadius: 23, borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 18, color: '#fff', fontSize: 15 },
});
