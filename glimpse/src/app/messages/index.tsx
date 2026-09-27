import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';

import { Avatar, Header, IconButton, Screen, SearchBar, T } from '@/components/ui';
import { useMe, useStore } from '@/store';
import { useTheme } from '@/theme';
import { timeShort } from '@/utils/format';

const NOTES: Record<string, string> = { u1: 'Lisbon next week ✈️', u12: 'shipping 🚀', u2: '🍝🍝🍝', u9: 'surf’s up' };

export default function Inbox() {
  const t = useTheme();
  const me = useMe();
  const chats = useStore((s) => s.chats);
  const users = useStore((s) => s.users);
  const chatWith = useStore((s) => s.chatWith);
  const [query, setQuery] = useState('');

  const mine = useMemo(
    () =>
      chats
        .filter((c) => c.ownerId === me.id)
        .map((c) => ({ chat: c, user: users.find((u) => u.id === c.userId)!, last: c.messages[c.messages.length - 1] }))
        .filter((x) => x.user && (!query || x.user.username.includes(query.toLowerCase()) || x.user.name.toLowerCase().includes(query.toLowerCase())))
        .sort((a, b) => (b.last?.createdAt ?? 0) - (a.last?.createdAt ?? 0)),
    [chats, users, me.id, query],
  );

  const noteUsers = users.filter((u) => NOTES[u.id]);

  return (
    <Screen>
      <Header
        center={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <T weight="700" size={20}>
              {me.username}
            </T>
            <Ionicons name="chevron-down" size={16} color={t.text} />
          </View>
        }
        right={
          <IconButton onPress={() => router.push('/explore')}>
            <Ionicons name="create-outline" size={26} color={t.text} />
          </IconButton>
        }
      />
      <FlatList
        data={mine}
        keyExtractor={(x) => x.chat.id}
        ListHeaderComponent={
          <>
            <SearchBar value={query} onChangeText={setQuery} placeholder="Search" style={{ marginHorizontal: 16, marginVertical: 8 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 22, paddingBottom: 8, gap: 12 }}>
              <View style={{ alignItems: 'center', width: 84 }}>
                <View style={[bubbleStyle, { backgroundColor: t.input }]}>
                  <T muted size={11} numberOfLines={2}>Note…</T>
                </View>
                <Avatar uri={me.avatar} size={72} />
                <T muted size={12} style={{ marginTop: 4 }}>Your note</T>
              </View>
              {noteUsers.map((u) => (
                <Pressable key={u.id} style={{ alignItems: 'center', width: 84 }} onPress={() => router.push(`/messages/${chatWith(u.id)}`)}>
                  <View style={[bubbleStyle, { backgroundColor: t.input }]}>
                    <T size={11} numberOfLines={2} style={{ textAlign: 'center' }}>
                      {NOTES[u.id]}
                    </T>
                  </View>
                  <Avatar uri={u.avatar} size={72} />
                  <T muted size={12} style={{ marginTop: 4 }} numberOfLines={1}>
                    {u.name.split(' ')[0]}
                  </T>
                </Pressable>
              ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 }}>
              <T weight="700" size={16}>Messages</T>
              <T muted weight="600">Requests</T>
            </View>
          </>
        }
        ListEmptyComponent={
          <T muted style={{ textAlign: 'center', marginTop: 40 }}>
            No messages yet.
          </T>
        }
        renderItem={({ item: { chat, user, last } }) => {
          const preview = !last
            ? 'Tap to chat'
            : last.postId
              ? last.from === me.id
                ? 'You sent a post'
                : 'Sent a post'
              : `${last.from === me.id ? 'You: ' : ''}${last.text}`;
          return (
            <Pressable
              onPress={() => router.push(`/messages/${chat.id}`)}
              style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: pressed ? t.separator : 'transparent' })}
            >
              <Avatar uri={user.avatar} size={56} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <T weight={chat.unread ? '700' : '400'} numberOfLines={1}>
                  {user.name}
                </T>
                <T size={13} muted={!chat.unread} weight={chat.unread ? '600' : '400'} numberOfLines={1}>
                  {preview}
                  {last ? ` · ${timeShort(last.createdAt)}` : ''}
                </T>
              </View>
              {chat.unread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.primary, marginRight: 12 }} />}
              <Ionicons name="camera-outline" size={26} color={t.textSecondary} />
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const bubbleStyle = {
  position: 'absolute' as const,
  top: -18,
  zIndex: 2,
  maxWidth: 84,
  paddingHorizontal: 8,
  paddingVertical: 5,
  borderRadius: 12,
  alignItems: 'center' as const,
};
