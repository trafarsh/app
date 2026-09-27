import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon } from '@/components/icons';
import { Button, Divider, IconButton, T } from '@/components/ui';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import { pickMedia, type PickedMedia } from '@/utils/media';

type Mode = 'POST' | 'STORY' | 'REEL';

export default function Create() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const width = Math.min(screenW, 600);
  const createPost = useStore((s) => s.createPost);
  const createReel = useStore((s) => s.createReel);
  const addStory = useStore((s) => s.addStory);

  const [mode, setMode] = useState<Mode>('POST');
  const [media, setMedia] = useState<PickedMedia[]>([]);
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [busy, setBusy] = useState(false);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const pick = async (camera = false) => {
    const aspect: [number, number] | undefined = mode === 'POST' ? [1, 1] : mode === 'STORY' ? [9, 16] : undefined;
    const m = await pickMedia({ camera, videos: mode === 'REEL', aspect, edit: mode !== 'REEL' });
    if (!m) return;
    setMedia((cur) => (mode === 'POST' && cur.length > 0 && cur.length < 10 ? [...cur, m] : [m]));
  };

  const next = () => {
    if (!media.length) return;
    if (mode === 'STORY') {
      addStory(media[0].uri);
      close();
      return;
    }
    setStep('details');
  };

  const share = async () => {
    if (!media.length) return;
    setBusy(true);
    try {
      if (mode === 'REEL' && media[0].type === 'video') {
        let poster = media[0].uri;
        try {
          poster = (await VideoThumbnails.getThumbnailAsync(media[0].uri, { time: 500 })).uri;
        } catch {
          // Fall back to the video URI; the grid will show a blank tile.
        }
        createReel({ video: media[0].uri, poster, caption });
      } else {
        const first = media[0];
        createPost({ images: media.map((m) => m.uri), aspect: Math.max(0.8, Math.min(1.91, first.width / first.height)), caption, location });
      }
      close();
      setTimeout(() => router.navigate(mode === 'REEL' ? '/reels' : '/'), 50);
    } finally {
      setBusy(false);
    }
  };

  const main = media[media.length - 1];

  if (step === 'details') {
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: t.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ paddingTop: insets.top }}>
          <View style={styles.bar}>
            <IconButton onPress={() => setStep('select')}>
              <Ionicons name="arrow-back" size={26} color={t.text} />
            </IconButton>
            <T weight="700" size={17} style={{ flex: 1, textAlign: 'center' }}>
              {mode === 'REEL' ? 'New reel' : 'New post'}
            </T>
            <View style={{ width: 26 }} />
          </View>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: 'row', padding: 16, gap: 14 }}>
            <Image source={{ uri: main.uri }} style={{ width: 80, height: 100, borderRadius: 6, backgroundColor: t.separator }} contentFit="cover" />
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="Add a caption…"
              placeholderTextColor={t.textSecondary}
              multiline
              style={{ flex: 1, color: t.text, fontSize: 16, textAlignVertical: 'top', minHeight: 100 }}
            />
          </View>
          <Divider />
          {mode === 'POST' && (
            <View style={styles.row}>
              <Ionicons name="location-outline" size={24} color={t.text} />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Add location"
                placeholderTextColor={t.text}
                style={{ flex: 1, color: t.text, fontSize: 16 }}
              />
            </View>
          )}
          <View style={styles.row}>
            <Ionicons name="person-outline" size={24} color={t.text} />
            <T size={16} style={{ flex: 1 }}>Tag people</T>
            <Ionicons name="chevron-forward" size={20} color={t.textSecondary} />
          </View>
          <View style={styles.row}>
            <Ionicons name="musical-notes-outline" size={24} color={t.text} />
            <T size={16} style={{ flex: 1 }}>Add music</T>
            <Ionicons name="chevron-forward" size={20} color={t.textSecondary} />
          </View>
          <View style={styles.row}>
            <Ionicons name="eye-outline" size={24} color={t.text} />
            <T size={16} style={{ flex: 1 }}>Audience</T>
            <T muted>Everyone</T>
            <Ionicons name="chevron-forward" size={20} color={t.textSecondary} />
          </View>
        </ScrollView>
        <View style={{ padding: 16, paddingBottom: insets.bottom + 12 }}>
          <Button title="Share" onPress={share} loading={busy} />
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.bar}>
          <IconButton onPress={close}>
            <CloseIcon color={t.text} size={30} />
          </IconButton>
          <T weight="700" size={17} style={{ flex: 1, textAlign: 'center' }}>
            {mode === 'POST' ? 'New post' : mode === 'STORY' ? 'Add to story' : 'New reel'}
          </T>
          <Pressable onPress={next} disabled={!media.length} hitSlop={10}>
            <T weight="600" size={16} style={{ color: media.length ? t.primary : t.textSecondary }}>
              {mode === 'STORY' ? 'Share' : 'Next'}
            </T>
          </Pressable>
        </View>
      </View>

      <Pressable onPress={() => pick(false)} style={{ width, height: mode === 'POST' ? width : width * 1.25, alignSelf: 'center', backgroundColor: t.separator, alignItems: 'center', justifyContent: 'center' }}>
        {main ? (
          main.type === 'video' ? (
            <View style={{ alignItems: 'center', gap: 8 }}>
              <Ionicons name="checkmark-circle" size={56} color={t.primary} />
              <T muted>Video selected — tap Next</T>
            </View>
          ) : (
            <Image source={{ uri: main.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
          )
        ) : (
          <View style={{ alignItems: 'center', gap: 10 }}>
            <Ionicons name={mode === 'REEL' ? 'film-outline' : 'images-outline'} size={64} color={t.textSecondary} />
            <T muted size={15}>
              Tap to choose {mode === 'REEL' ? 'a video' : 'a photo'}
            </T>
          </View>
        )}
        {busy && <ActivityIndicator style={StyleSheet.absoluteFill} />}
      </Pressable>

      {media.length > 1 && (
        <ScrollView horizontal contentContainerStyle={{ gap: 6, padding: 8 }} showsHorizontalScrollIndicator={false}>
          {media.map((m, i) => (
            <Pressable key={`${m.uri}-${i}`} onLongPress={() => setMedia((cur) => cur.filter((_, k) => k !== i))}>
              <Image source={{ uri: m.uri }} style={{ width: 56, height: 56, borderRadius: 4 }} />
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, padding: 16 }}>
        <Button small variant="secondary" title="Gallery" icon={<Ionicons name="images-outline" size={16} color={t.text} />} onPress={() => pick(false)} />
        <Button small variant="secondary" title="Camera" icon={<Ionicons name="camera-outline" size={16} color={t.text} />} onPress={() => pick(true)} />
        {mode === 'POST' && media.length > 0 && media.length < 10 && (
          <Button small variant="secondary" title="Add more" icon={<Ionicons name="copy-outline" size={16} color={t.text} />} onPress={() => pick(false)} />
        )}
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ flexDirection: 'row', alignSelf: 'center', gap: 4, marginBottom: insets.bottom + 16, backgroundColor: t.dark ? '#262626' : '#1c1c1c', borderRadius: 20, padding: 4 }}>
        {(['POST', 'STORY', 'REEL'] as Mode[]).map((m) => (
          <Pressable
            key={m}
            onPress={() => {
              setMode(m);
              setMedia([]);
            }}
            style={{ paddingHorizontal: 16, paddingVertical: 7, borderRadius: 16, backgroundColor: mode === m ? '#444' : 'transparent' }}
          >
            <T weight="700" size={13} style={{ color: mode === m ? '#fff' : '#aaa', letterSpacing: 0.5 }}>
              {m}
            </T>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 16 },
});
