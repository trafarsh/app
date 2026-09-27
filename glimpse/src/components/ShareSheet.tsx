import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Share, View } from 'react-native';

import { useStore } from '@/store';
import { useTheme } from '@/theme';

import { Avatar, Button, SearchBar, Sheet, T } from './ui';

/** "Send to" sheet: pick people and send them a post in DMs. */
export function ShareSheet({ postId, visible, onClose }: { postId: string; visible: boolean; onClose: () => void }) {
  const t = useTheme();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const users = useStore((s) => s.users);
  const meId = useStore((s) => s.currentUserId);
  const chatWith = useStore((s) => s.chatWith);
  const sendMessage = useStore((s) => s.sendMessage);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => u.id !== meId && (!q || u.username.includes(q) || u.name.toLowerCase().includes(q)));
  }, [users, meId, query]);

  const close = () => {
    setSelected([]);
    setQuery('');
    onClose();
  };

  const send = () => {
    selected.forEach((userId) => sendMessage(chatWith(userId), '', postId));
    close();
  };

  return (
    <Sheet visible={visible} onClose={close}>
      <SearchBar value={query} onChangeText={setQuery} style={{ marginHorizontal: 16, marginBottom: 12 }} />
      <FlatList
        data={list}
        numColumns={3}
        keyExtractor={(u) => u.id}
        style={{ maxHeight: 360 }}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        renderItem={({ item }) => {
          const on = selected.includes(item.id);
          return (
            <Pressable
              onPress={() => setSelected((s) => (on ? s.filter((x) => x !== item.id) : [...s, item.id]))}
              style={{ width: '33.33%', alignItems: 'center', paddingVertical: 10 }}
            >
              <View>
                <Avatar uri={item.avatar} size={72} />
                {on && (
                  <View style={{ position: 'absolute', right: 0, bottom: 0, backgroundColor: t.primary, borderRadius: 12, borderWidth: 2, borderColor: t.sheet }}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </View>
              <T size={12} numberOfLines={1} style={{ marginTop: 6, maxWidth: 90 }}>
                {item.name}
              </T>
            </Pressable>
          );
        }}
      />
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        {selected.length > 0 ? (
          <Button title={selected.length > 1 ? 'Send separately' : 'Send'} onPress={send} />
        ) : (
          <Button
            title="Share to…"
            variant="secondary"
            onPress={() => {
              close();
              Share.share({ message: `Check out this post on Glimpse: glimpse.app/p/${postId}` }).catch(() => {});
            }}
          />
        )}
      </View>
    </Sheet>
  );
}
