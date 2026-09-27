import { useColorScheme } from 'react-native';

import { useStore } from '@/store';

const light = {
  dark: false,
  bg: '#FFFFFF',
  text: '#000000',
  textSecondary: '#737373',
  border: '#DBDBDB',
  separator: '#EFEFEF',
  input: '#EFEFEF',
  elevated: '#FFFFFF',
  button: '#EFEFEF',
  primary: '#0095F6',
  primaryPressed: '#1877F2',
  link: '#00376B',
  like: '#FF3040',
  bubbleOther: '#EFEFEF',
  sheet: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.4)',
};

const dark: typeof light = {
  dark: true,
  bg: '#000000',
  text: '#F5F5F5',
  textSecondary: '#A8A8A8',
  border: '#363636',
  separator: '#262626',
  input: '#262626',
  elevated: '#121212',
  button: '#363636',
  primary: '#0095F6',
  primaryPressed: '#1877F2',
  link: '#E0F1FF',
  like: '#FF3040',
  bubbleOther: '#262626',
  sheet: '#262626',
  overlay: 'rgba(0,0,0,0.6)',
};

export type Theme = typeof light;

/** Instagram's story ring / brand gradient. */
export const STORY_GRADIENT = ['#FEDA75', '#FA7E1E', '#D62976', '#962FBF', '#4F5BD5'] as const;
export const DM_GRADIENT = ['#A033FF', '#5B51D8', '#0095F6'] as const;

export function useTheme(): Theme {
  const system = useColorScheme();
  const pref = useStore((s) => s.appearance);
  const mode = pref === 'system' ? system : pref;
  return mode === 'dark' ? dark : light;
}
