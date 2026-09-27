import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/components/Logo';
import { Button, Input, T } from '@/components/ui';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

export default function Signup() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const signup = useStore((s) => s.signup);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: t.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 40, paddingHorizontal: 32 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center' }}>
          <Logo size={52} />
          <T muted weight="600" size={16} style={{ textAlign: 'center', marginTop: 8, marginBottom: 24 }}>
            Sign up to see photos and videos from your friends.
          </T>
        </View>
        <View style={{ gap: 10 }}>
          <Input placeholder="Full name" value={name} onChangeText={setName} autoCapitalize="words" />
          <Input placeholder="Username" value={username} onChangeText={setUsername} />
          <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          {error && (
            <T size={13} style={{ color: t.like, textAlign: 'center' }}>
              {error}
            </T>
          )}
          <T muted size={12} style={{ textAlign: 'center', marginVertical: 8 }}>
            By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </T>
          <Button
            title="Sign up"
            disabled={!name || !username || !password}
            onPress={() => setError(signup({ name, username, password }))}
          />
        </View>
      </ScrollView>
      <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.border, paddingVertical: 18, paddingBottom: insets.bottom + 18, alignItems: 'center' }}>
        <T muted>
          Have an account?{' '}
          <T weight="600" style={{ color: t.primary }} onPress={() => router.back()}>
            Log in
          </T>
        </T>
      </View>
    </KeyboardAvoidingView>
  );
}
