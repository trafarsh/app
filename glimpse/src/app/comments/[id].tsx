import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeartIcon } from '@/components/icons';
import { RichText } from '@/components/RichText';
import { Avatar, Divider, EmptyState, Header, Screen, T } from '@/components/ui';
import type { Comment } from '@/data/types';
import { useMe, useStore } from '@/store';
import { useTheme } from '@/theme';
import { timeShort } from '@/utils/format';

const EMOJIS = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];

export default function Comments() {
  const { id, kind = 'post' } = useLocalSearchParams<{ id: string; kind?: 'post' | 'reel' }>();
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const post = useStore((s) => (kind === 'post' ? s.posts.find((p) => p.id === id) : undefined));
  const reel = useStore((s) => (kind === 'reel' ? s.reels.find((r) => r.id === id) : undefined));
  const users = useStore((s) => s.users);
  const addComment = useStore((s) => s.addComment);
  const toggleCommentLike = useStore((s) => s.toggleCommentLike);
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const listRef = useRef<FlatList<Comment>>(null);

  const target = post ?? reel;
  if (!target) {
    return (
      <Screen>
        <Header title="Comments" />
        <EmptyState icon="chatbubble-outline" title="Post not found" />
      </Screen>
    );
  }
  const author = users.find((u) => u.id === target.userId);

  const submit = () => {
    if (!text.trim()) return;
    addComment(kind, target.id, text);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const replyTo = (username: string) => {
    setText(`@${username} `);
    inputRef.current?.focus();
  };

  return (
    <Screen>
      <Header title="Comments" border />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={listRef}
          data={target.comments}
          keyExtractor={(c) => c.id}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            author && target.caption ? (
              <>
                <View style={styles.row}>
                  <Avatar uri={author.avatar} size={34} onPress={() => router.push(`/user/${author.username}`)} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <RichText username={author.username} text={target.caption} />
                    <T muted size={12} style={{ marginTop: 4 }}>
                      {timeShort(target.createdAt)}
                    </T>
                  </View>
                </View>
                <Divider />
              </>
            ) : null
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <T weight="700" size={22}>No comments yet</T>
              <T muted style={{ marginTop: 6 }}>Start the conversation.</T>
            </View>
          }
          renderItem={({ item }) => {
            const u = users.find((x) => x.id === item.userId);
            if (!u) return null;
            const liked = item.likes.includes(me.id);
            return (
              <View style={styles.row}>
                <Avatar uri={u.avatar} size={34} onPress={() => router.push(`/user/${u.username}`)} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <T size={13}>
                    <T weight="600" size={13} onPress={() => router.push(`/user/${u.username}`)}>
                      {u.username}
                    </T>
                    <T muted size={12}>{'  '}{timeShort(item.createdAt)}</T>
                  </T>
                  <RichText text={item.text} style={{ marginTop: 2 }} />
                  <View style={{ flexDirection: 'row', gap: 16, marginTop: 6 }}>
                    {item.likes.length > 0 && (
                      <T muted size={12} weight="600">
                        {item.likes.length} {item.likes.length === 1 ? 'like' : 'likes'}
                      </T>
                    )}
                    <T muted size={12} weight="600" onPress={() => replyTo(u.username)}>
                      Reply
                    </T>
                  </View>
                </View>
                <Pressable hitSlop={10} onPress={() => toggleCommentLike(kind, target.id, item.id)} style={{ paddingLeft: 12, paddingTop: 8 }}>
                  <HeartIcon size={14} filled={liked} color={liked ? t.like : t.textSecondary} />
                </Pressable>
              </View>
            );
          }}
        />

        <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.border, paddingBottom: insets.bottom + 6, backgroundColor: t.bg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
            {EMOJIS.map((e) => (
              <Pressable key={e} onPress={() => setText((v) => v + e)} hitSlop={4}>
                <T size={24}>{e}</T>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 12 }}>
            <Avatar uri={me.avatar} size={38} />
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: t.border, borderRadius: 22, paddingLeft: 16, paddingRight: 8, minHeight: 44 }}>
              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={setText}
                placeholder={`Add a comment for ${author?.username ?? ''}…`}
                placeholderTextColor={t.textSecondary}
                style={{ flex: 1, color: t.text, fontSize: 15, paddingVertical: 8 }}
                multiline
              />
              {text.trim().length > 0 && (
                <Pressable onPress={submit} hitSlop={8} style={{ paddingHorizontal: 6 }}>
                  <T weight="600" style={{ color: t.primary }}>
                    Post
                  </T>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 12 },
});
