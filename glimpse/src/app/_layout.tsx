import { GrandHotel_400Regular } from '@expo-google-fonts/grand-hotel';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useStore } from '@/store';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const t = useTheme();
  const hydrated = useStore((s) => s.hydrated);
  const loggedIn = useStore((s) => s.currentUserId !== null && s.users.some((u) => u.id === s.currentUserId));
  const [fontsLoaded, fontError] = useFonts({ GrandHotel_400Regular });
  const ready = hydrated && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(t.bg).catch(() => {});
  }, [t.bg]);

  if (!ready) return null;

  const navTheme = t.dark
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: t.bg, card: t.bg, text: t.text, border: t.border, primary: t.primary } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: t.bg, card: t.bg, text: t.text, border: t.border, primary: t.primary } };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: t.bg }}>
      <SafeAreaProvider>
        <ThemeProvider value={navTheme}>
          <StatusBar style={t.dark ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg }, animation: 'slide_from_right' }}>
            <Stack.Protected guard={!loggedIn}>
              <Stack.Screen name="login" options={{ animation: 'fade' }} />
              <Stack.Screen name="signup" />
            </Stack.Protected>
            <Stack.Protected guard={loggedIn}>
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen name="create" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="story/[userId]" options={{ presentation: 'fullScreenModal', animation: 'fade', contentStyle: { backgroundColor: '#000' } }} />
              <Stack.Screen name="comments/[id]" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="post/[id]" />
              <Stack.Screen name="user/[username]" />
              <Stack.Screen name="follows/[userId]" />
              <Stack.Screen name="messages/index" />
              <Stack.Screen name="messages/[chatId]" />
              <Stack.Screen name="activity" />
              <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="settings" />
              <Stack.Screen name="saved" />
            </Stack.Protected>
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
