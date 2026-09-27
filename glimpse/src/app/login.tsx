import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/components/Logo';
import { Button, Divider, Input, T } from '@/components/ui';
import { DEMO_ACCOUNT } from '@/data/seed';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

export default function Login() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const login = useStore((s) => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (u = username, p = password) => setError(login(u, p));

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: t.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingHorizontal: 24, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Logo size={56} />
        </View>

        <View style={{ gap: 10 }}>
          <Input placeholder="Username, email or mobile number" value={username} onChangeText={setUsername} textContentType="username" returnKeyType="next" />
          <View>
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={() => submit()}
              style={{ paddingRight: 64 }}
            />
            {password.length > 0 && (
              <Pressable onPress={() => setShowPw((v) => !v)} style={styles.show}>
                <T weight="600" size={14}>
                  {showPw ? 'Hide' : 'Show'}
                </T>
              </Pressable>
            )}
          </View>
          {error && (
            <T size={13} style={{ color: t.like, textAlign: 'center' }}>
              {error}
            </T>
          )}
          <Button title="Log in" onPress={() => submit()} disabled={!username || !password} style={{ marginTop: 6 }} />
        </View>

        <T weight="600" style={{ color: t.link, textAlign: 'center', marginTop: 18 }} size={13}>
          Forgot password?
        </T>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 24 }}>
          <Divider style={{ flex: 1 }} />
          <T muted weight="600" size={13} style={{ marginHorizontal: 18 }}>
            OR
          </T>
          <Divider style={{ flex: 1 }} />
        </View>

        <Button
          title="Try the demo account"
          variant="link"
          onPress={() => {
            setUsername(DEMO_ACCOUNT.username);
            setPassword(DEMO_ACCOUNT.password);
            submit(DEMO_ACCOUNT.username, DEMO_ACCOUNT.password);
          }}
        />
        <T muted size={12} style={{ textAlign: 'center', marginTop: 4 }}>
          {DEMO_ACCOUNT.username} / {DEMO_ACCOUNT.password}
        </T>
      </ScrollView>

      <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.border, paddingVertical: 18, paddingBottom: insets.bottom + 18, alignItems: 'center' }}>
        <T muted size={14}>
          Don&apos;t have an account?{' '}
          <T weight="600" size={14} style={{ color: t.primary }} onPress={() => router.push('/signup')}>
            Sign up.
          </T>
        </T>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  show: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
});
