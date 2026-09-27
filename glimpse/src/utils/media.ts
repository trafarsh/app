import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export type PickedMedia = { uri: string; width: number; height: number; type: 'image' | 'video' };

export async function pickMedia(opts: {
  camera?: boolean;
  videos?: boolean;
  aspect?: [number, number];
  edit?: boolean;
} = {}): Promise<PickedMedia | null> {
  const perm = opts.camera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Permission needed', `Allow access to your ${opts.camera ? 'camera' : 'photos'} in Settings to continue.`);
    return null;
  }

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: opts.videos ? ['videos'] : ['images'],
    allowsEditing: opts.edit ?? true,
    aspect: opts.aspect,
    quality: 0.85,
    videoMaxDuration: 90,
  };
  const res = opts.camera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
  if (res.canceled || !res.assets?.[0]) return null;
  const a = res.assets[0];
  return { uri: a.uri, width: a.width || 1080, height: a.height || 1080, type: a.type === 'video' ? 'video' : 'image' };
}
