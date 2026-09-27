import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Avatar, Header, Screen, T } from '@/components/ui';
import { useMe, useStore } from '@/store';
import { useTheme } from '@/theme';
import { pickMedia } from '@/utils/media';

export default function EditProfile() {
  const t = useTheme();
  const me = useMe();
  const updateProfile = useStore((s) => s.updateProfile);
  const [avatar, setAvatar] = useState(me.avatar);
  const [name, setName] = useState(me.name);
  const [username, setUsername] = useState(me.username);
  const [bio, setBio] = useState(me.bio);
  const [website, setWebsite] = useState(me.website ?? '');
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const err = updateProfile({ avatar, name: name.trim(), username, bio, website: website.trim() || undefined });
    if (err) setError(err);
    else router.back();
  };

  const changePhoto = async () => {
    const m = await pickMedia({ aspect: [1, 1] });
    if (m) setAvatar(m.uri);
  };

  const field = (label: string, value: string, onChange: (v: string) => void, multiline = false) => (
    <View style={[styles.field, { borderColor: t.border }]}>
      <T muted size={12}>
        {label}
      </T>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        autoCapitalize={label === 'Name' || label === 'Bio' ? 'sentences' : 'none'}
        autoCorrect={label === 'Bio'}
        style={{ color: t.text, fontSize: 16, paddingVertical: 4, minHeight: multiline ? 60 : undefined, textAlignVertical: 'top' }}
        placeholderTextColor={t.textSecondary}
        placeholder={label}
      />
    </View>
  );

  return (
    <Screen>
      <Header
        title="Edit profile"
        right={
          <Pressable onPress={save} hitSlop={10}>
            <T weight="700" size={16} style={{ color: t.primary }}>
              Done
            </T>
          </Pressable>
        }
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Avatar uri={avatar} size={90} onPress={changePhoto} />
            <T weight="600" style={{ color: t.primary }} onPress={changePhoto}>
              Edit picture or avatar
            </T>
          </View>
          {field('Name', name, setName)}
          {field('Username', username, setUsername)}
          {field('Bio', bio, setBio, true)}
          {field('Links', website, setWebsite)}
          {error && <T style={{ color: t.like }}>{error}</T>}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
});
