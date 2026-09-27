import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, View } from 'react-native';

import { Divider, Header, Screen, T } from '@/components/ui';
import { useMe, useStore } from '@/store';
import { useTheme } from '@/theme';

type Row = { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void; value?: string; danger?: boolean };

export default function Settings() {
  const t = useTheme();
  const me = useMe();
  const appearance = useStore((s) => s.appearance);
  const setAppearance = useStore((s) => s.setAppearance);
  const logout = useStore((s) => s.logout);
  const resetDemoData = useStore((s) => s.resetDemoData);

  const cycleAppearance = () => setAppearance(appearance === 'system' ? 'light' : appearance === 'light' ? 'dark' : 'system');

  const confirm = (title: string, message: string, onOk: () => void) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) onOk();
      return;
    }
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: title, style: 'destructive', onPress: onOk },
    ]);
  };

  const sections: { title: string; rows: Row[] }[] = [
    {
      title: 'How you use Glimpse',
      rows: [
        { icon: 'bookmark-outline', label: 'Saved', onPress: () => router.push('/saved') },
        { icon: 'time-outline', label: 'Archive' },
        { icon: 'stats-chart-outline', label: 'Your activity', onPress: () => router.push('/activity') },
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => router.push('/activity') },
      ],
    },
    {
      title: 'Who can see your content',
      rows: [
        { icon: 'lock-closed-outline', label: 'Account privacy', value: 'Public' },
        { icon: 'star-outline', label: 'Close Friends', value: '0' },
        { icon: 'ban-outline', label: 'Blocked', value: '0' },
      ],
    },
    {
      title: 'Your app and media',
      rows: [
        { icon: 'moon-outline', label: 'Appearance', value: appearance[0].toUpperCase() + appearance.slice(1), onPress: cycleAppearance },
        { icon: 'language-outline', label: 'Language', value: 'English' },
        { icon: 'refresh-outline', label: 'Reset demo data', onPress: () => confirm('Reset', 'Restore all demo posts, chats and accounts? Your own posts will be removed.', resetDemoData) },
      ],
    },
    {
      title: 'Login',
      rows: [
        { icon: 'person-add-outline', label: 'Add account', onPress: logout },
        { icon: 'log-out-outline', label: `Log out ${me.username}`, danger: true, onPress: () => confirm('Log out', `Log out of ${me.username}?`, logout) },
      ],
    },
  ];

  return (
    <Screen>
      <Header title="Settings and activity" />
      <ScrollView>
        {sections.map((section, i) => (
          <View key={section.title}>
            {i > 0 && <Divider style={{ height: 6, backgroundColor: t.separator }} />}
            <T muted weight="600" size={13} style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 }}>
              {section.title}
            </T>
            {section.rows.map((r) => (
              <Pressable
                key={r.label}
                onPress={r.onPress}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: pressed ? t.separator : 'transparent' })}
              >
                <Ionicons name={r.icon} size={24} color={r.danger ? t.like : t.text} />
                <T size={16} style={{ flex: 1, color: r.danger ? t.like : t.text }}>
                  {r.label}
                </T>
                {r.value && <T muted>{r.value}</T>}
                {!r.danger && <Ionicons name="chevron-forward" size={18} color={t.textSecondary} />}
              </Pressable>
            ))}
          </View>
        ))}
        <T muted size={12} style={{ textAlign: 'center', paddingVertical: 24 }}>
          Glimpse · Portfolio project · v1.0.0
        </T>
      </ScrollView>
    </Screen>
  );
}
