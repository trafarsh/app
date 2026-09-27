import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackIcon, HeartIcon } from '@/components/icons';
import { Avatar, Button, EmptyState, Header, IconButton, Screen, T } from '@/components/ui';
import type { Message } from '@/data/types';
import { useMe, useStore } from '@/store';
import { DM_GRADIENT, useTheme } from '@/theme';
import { formatCount } from '@/utils/format';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const chat = useStore((s) => s.chats.find((c) => c.id === chatId));
  const other = useStore((s) => s.users.find((u) => u.id === chat?.userId));
  const posts = useStore((s) => s.posts);
  const users = useStore((s) => s.users);
  const typing = useStore((s) => s.typing[chatId]);
  const sendMessage = useStore((s) => s.sendMessage);
  const toggleMessageLike = useStore((s) => s.toggleMessageLike);
  const markChatRead = useStore((s) => s.markChatRead);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<Message>>(null);
  const lastTaps = useRef<Record<string, number>>({});

  useEffect(() => {
    if (chat?.unread) markChatRead(chat.id);
  }, [chat?.unread, chat?.id, markChatRead]);

  if (!chat || !other) {
    return (
      <Screen>
        <Header title="Chat" />
        <EmptyState icon="chatbubbles-outline" title="Chat not found" />
      </Screen>
    );
  }

  const messages = [...chat.messages].reverse();
  const send = (value = text) => {
    if (!value.trim()) return;
    sendMessage(chat.id, value);
    setText('');
  };

  return (
    <Screen>
      <View style={{ paddingTop: insets.top, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.border }}>
        <View style={{ height: 54, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 10 }}>
          <IconButton onPress={() => router.back()}>
            <BackIcon color={t.text} />
          </IconButton>
          <Pressable onPress={() => router.push(`/user/${other.username}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <Avatar uri={other.avatar} size={34} />
            <View style={{ flex: 1 }}>
              <T weight="700" size={15} numberOfLines={1}>
                {other.name}
              </T>
              <T muted size={12} numberOfLines={1}>
                {typing ? 'typing…' : other.username}
              </T>
            </View>
          </Pressable>
          <View style={{ flexDirection: 'row', gap: 22, paddingRight: 6 }}>
            <Ionicons name="call-outline" size={25} color={t.text} />
            <Ionicons name="videocam-outline" size={28} color={t.text} />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <FlatList
          ref={listRef}
          data={messages}
          inverted
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}
          ListHeaderComponent={
            typing ? (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 4 }}>
                <Avatar uri={other.avatar} size={28} />
                <View style={[styles.bubble, { backgroundColor: t.bubbleOther, flexDirection: 'row', gap: 4, paddingVertical: 14 }]}>
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: t.textSecondary }} />
                  ))}
                </View>
              </View>
            ) : null
          }
          ListFooterComponent={
            <View style={{ alignItems: 'center', paddingVertical: 28, gap: 4 }}>
              <Avatar uri={other.avatar} size={96} />
              <T weight="700" size={20} style={{ marginTop: 8 }}>
                {other.name}
              </T>
              <T muted>{other.username} · Glimpse</T>
              <T muted size={13}>
                {formatCount(other.baseFollowers)} followers
              </T>
              <Button small variant="secondary" title="View profile" style={{ marginTop: 10 }} onPress={() => router.push(`/user/${other.username}`)} />
            </View>
          }
          renderItem={({ item, index }) => {
            const mine = item.from === me.id;
            // Show the avatar only on the last message of a run from the other person (list is inverted).
            const prevNewer = messages[index - 1];
            const showAvatar = !mine && (!prevNewer || prevNewer.from !== item.from);
            const post = item.postId ? posts.find((p) => p.id === item.postId) : undefined;
            const postAuthor = post ? users.find((u) => u.id === post.userId) : undefined;

            // Double-tap a message to react with a heart.
            const onPress = () => {
              const now = Date.now();
              if (now - (lastTaps.current[item.id] ?? 0) < 280) toggleMessageLike(chat.id, item.id);
              lastTaps.current[item.id] = now;
            };

            return (
              <View style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', marginVertical: 2, gap: 8 }}>
                {!mine && <View style={{ width: 28 }}>{showAvatar && <Avatar uri={other.avatar} size={28} />}</View>}
                <Pressable onPress={onPress} onLongPress={() => toggleMessageLike(chat.id, item.id)} style={{ maxWidth: '75%' }}>
                  {post && postAuthor ? (
                    <Pressable onPress={() => router.push(`/post/${post.id}`)} style={[styles.shared, { backgroundColor: t.bubbleOther }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10 }}>
                        <Avatar uri={postAuthor.avatar} size={26} />
                        <T weight="600" size={13}>
                          {postAuthor.username}
                        </T>
                      </View>
                      <Image source={{ uri: post.images[0] }} style={{ width: 220, height: 220 / post.aspect }} contentFit="cover" />
                      {post.caption ? (
                        <T size={13} numberOfLines={2} style={{ padding: 10 }}>
                          <T weight="600" size={13}>{postAuthor.username} </T>
                          {post.caption}
                        </T>
                      ) : null}
                    </Pressable>
                  ) : mine ? (
                    <LinearGradient colors={[...DM_GRADIENT]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bubble}>
                      <T style={{ color: '#fff' }} size={15}>
                        {item.text}
                      </T>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.bubble, { backgroundColor: t.bubbleOther }]}>
                      <T size={15}>{item.text}</T>
                    </View>
                  )}
                  {item.liked && (
                    <View style={[styles.reaction, { backgroundColor: t.bg, borderColor: t.bg, alignSelf: mine ? 'flex-end' : 'flex-start' }]}>
                      <T size={12}>❤️</T>
                    </View>
                  )}
                </Pressable>
              </View>
            );
          }}
        />

        {/* composer */}
        <View style={{ paddingHorizontal: 10, paddingTop: 6, paddingBottom: insets.bottom + 8 }}>
          <View style={[styles.composer, { backgroundColor: t.input }]}>
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Message…"
              placeholderTextColor={t.textSecondary}
              style={{ flex: 1, color: t.text, fontSize: 16, paddingVertical: 8, maxHeight: 110 }}
              multiline
            />
            {text.trim() ? (
              <Pressable onPress={() => send()} hitSlop={8} style={{ paddingHorizontal: 12 }}>
                <T weight="700" style={{ color: t.primary }}>
                  Send
                </T>
              </Pressable>
            ) : (
              <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 10 }}>
                <Ionicons name="mic-outline" size={25} color={t.text} />
                <Ionicons name="image-outline" size={25} color={t.text} />
                <Pressable onPress={() => send('❤️')} hitSlop={6}>
                  <HeartIcon size={25} color={t.text} />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bubble: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 22 },
  shared: { borderRadius: 18, overflow: 'hidden', width: 220 },
  reaction: { marginTop: -8, borderRadius: 12, paddingHorizontal: 4, paddingVertical: 1, borderWidth: 2, marginHorizontal: 8 },
  composer: { flexDirection: 'row', alignItems: 'center', borderRadius: 24, minHeight: 48, paddingLeft: 6 },
  cameraBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0095F6', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
});
