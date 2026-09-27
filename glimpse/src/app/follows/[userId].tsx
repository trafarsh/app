import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Button, Header, Screen, SearchBar, T, Username } from '@/components/ui';
import { followerCount, useMe, useStore } from '@/store';
import { useTheme } from '@/theme';
import { formatCount } from '@/utils/format';

type Tab = 'followers' | 'following';

export default function Follows() {
  const params = useLocalSearchParams<{ userId: string; tab?: Tab }>();
  const t = useTheme();
  const me = useMe();
  const users = useStore((s) => s.users);
  const toggleFollow = useStore((s) => s.toggleFollow);
  const removeFollower = useStore((s) => s.removeFollower);
  const [tab, setTab] = useState<Tab>(params.tab ?? 'followers');
  const [query, setQuery] = useState('');
  const user = users.find((u) => u.id === params.userId);

  const list = useMemo(() => {
    if (!user) return [];
    const base = tab === 'followers' ? users.filter((u) => u.following.includes(user.id)) : users.filter((u) => user.following.includes(u.id));
    const q = query.toLowerCase();
    return base.filter((u) => !q || u.username.includes(q) || u.name.toLowerCase().includes(q));
  }, [users, user, tab, query]);

  if (!user) return null;
  const isMe = user.id === me.id;

  return (
    <Screen>
      <Header title={user.username} />
      <View style={{ flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.border }}>
        {(['followers', 'following'] as Tab[]).map((k) => (
          <Pressable key={k} onPress={() => setTab(k)} style={{ flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: tab === k ? 1.5 : 0, borderBottomColor: t.text }}>
            <T weight="600" muted={tab !== k}>
              {k === 'followers' ? `${formatCount(followerCount(users, user))} followers` : `${user.following.length} following`}
            </T>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={list}
        keyExtractor={(u) => u.id}
        ListHeaderComponent={<SearchBar value={query} onChangeText={setQuery} style={{ margin: 16 }} />}
        ListEmptyComponent={
          <T muted style={{ textAlign: 'center', marginTop: 30 }}>
            {tab === 'followers' ? 'No followers in this list yet.' : 'Not following anyone yet.'}
          </T>
        }
        renderItem={({ item }) => {
          const following = me.following.includes(item.id);
          return (
            <Pressable onPress={() => router.push(`/user/${item.username}`)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
              <Avatar uri={item.avatar} size={52} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Username name={item.username} verified={item.verified} />
                <T muted size={13}>
                  {item.name}
                </T>
              </View>
              {item.id !== me.id &&
                (isMe && tab === 'followers' ? (
                  <Button small variant="secondary" title="Remove" onPress={() => removeFollower(item.id)} />
                ) : (
                  <Button small variant={following ? 'secondary' : 'primary'} title={following ? 'Following' : 'Follow'} onPress={() => toggleFollow(item.id)} />
                ))}
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}
