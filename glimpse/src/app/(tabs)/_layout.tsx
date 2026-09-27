import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CreateIcon, HomeIcon, ReelsIcon, SearchIcon } from '@/components/icons';
import { Avatar } from '@/components/ui';
import { useMe } from '@/store';
import { useTheme } from '@/theme';

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

function TabBar({ state, navigation }: TabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const current = state.routes[state.index]?.name;
  // Reels is always shown on a black background, like the real app.
  const onReels = current === 'reels';
  const fg = onReels ? '#FFFFFF' : theme.text;
  const bg = onReels ? '#000000' : theme.bg;

  const go = (name: string) => {
    if (name === 'new') {
      router.push('/create');
      return;
    }
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented) navigation.navigate(name);
  };

  const items: { name: string; render: (active: boolean) => React.ReactNode }[] = [
    { name: 'index', render: (a) => <HomeIcon active={a} color={fg} size={27} /> },
    { name: 'explore', render: (a) => <SearchIcon active={a} color={fg} size={27} /> },
    { name: 'new', render: () => <CreateIcon color={fg} size={28} /> },
    { name: 'reels', render: (a) => <ReelsIcon active={a} color={fg} bg={bg} size={26} /> },
    {
      name: 'profile',
      render: (a) => (
        <View style={{ borderRadius: 16, borderWidth: a ? 2 : 0, borderColor: fg, padding: a ? 1 : 0 }}>
          <Avatar uri={me?.avatar} size={a ? 24 : 28} />
        </View>
      ),
    },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: bg,
        borderTopWidth: onReels ? 0 : StyleSheet.hairlineWidth,
        borderTopColor: theme.border,
        paddingBottom: insets.bottom,
      }}
    >
      {items.map((it) => (
        <Pressable
          key={it.name}
          accessibilityRole="tab"
          accessibilityLabel={it.name}
          onPress={() => go(it.name)}
          style={{ flex: 1, height: 52, alignItems: 'center', justifyContent: 'center' }}
        >
          {it.render(current === it.name)}
        </Pressable>
      ))}
    </View>
  );
}

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: t.bg } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="new" />
      <Tabs.Screen name="reels" options={{ sceneStyle: { backgroundColor: '#000' } }} />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
