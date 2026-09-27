import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { STORY_GRADIENT, useTheme } from '@/theme';

import { BackIcon, VerifiedBadge } from './icons';

/* ---------------- Avatar ---------------- */

type AvatarProps = {
  uri?: string;
  size: number;
  /** "unseen" draws the gradient story ring, "seen" a thin grey ring. */
  ring?: 'none' | 'unseen' | 'seen' | 'close';
  onPress?: () => void;
  onLongPress?: () => void;
};

export function Avatar({ uri, size, ring = 'none', onPress, onLongPress }: AvatarProps) {
  const t = useTheme();
  const pad = ring === 'none' ? 0 : size > 60 ? 4 : 3;
  const inner = size - pad * 2;

  const img = uri ? (
    <Image source={{ uri }} style={{ width: inner, height: inner, borderRadius: inner / 2, backgroundColor: t.separator }} transition={150} />
  ) : (
    <View style={{ width: inner, height: inner, borderRadius: inner / 2, backgroundColor: t.dark ? '#555' : '#C7C7C7', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' }}>
      <Ionicons name="person" size={inner * 0.85} color={t.dark ? '#999' : '#F2F2F2'} style={{ marginBottom: -inner * 0.12 }} />
    </View>
  );

  let content: ReactNode = img;
  if (ring !== 'none') {
    const gap = size > 60 ? 3 : 2;
    const holder = (
      <View style={{ padding: gap, borderRadius: size, backgroundColor: t.bg }}>
        <View style={{ width: inner - gap * 2, height: inner - gap * 2, borderRadius: size, overflow: 'hidden' }}>
          {uri ? <Image source={{ uri }} style={{ width: '100%', height: '100%' }} transition={150} /> : img}
        </View>
      </View>
    );
    content =
      ring === 'unseen' || ring === 'close' ? (
        <LinearGradient
          colors={ring === 'close' ? ['#1BD760', '#1BD760'] : [...STORY_GRADIENT].reverse() as unknown as [string, string, ...string[]]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}
        >
          {holder}
        </LinearGradient>
      ) : (
        <View style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: t.border }}>
          {holder}
        </View>
      );
  }

  if (!onPress && !onLongPress) return <View>{content}</View>;
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} hitSlop={4}>
      {content}
    </Pressable>
  );
}

/* ---------------- Text helpers ---------------- */

export function T({ style, children, weight, muted, size = 14, numberOfLines, onPress }: {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
  weight?: '400' | '500' | '600' | '700';
  muted?: boolean;
  size?: number;
  numberOfLines?: number;
  onPress?: () => void;
}) {
  const t = useTheme();
  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={[{ color: muted ? t.textSecondary : t.text, fontSize: size, fontWeight: weight ?? '400' }, style]}
    >
      {children}
    </Text>
  );
}

export function Username({ name, verified, size = 14, onPress, style }: {
  name: string;
  verified?: boolean;
  size?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      <T weight="600" size={size}>
        {name}
      </T>
      {verified && <VerifiedBadge size={size - 1} />}
    </Pressable>
  );
}

/* ---------------- Buttons ---------------- */

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'link';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
  icon?: ReactNode;
};

export function Button({ title, onPress, variant = 'primary', disabled, loading, style, small, icon }: ButtonProps) {
  const t = useTheme();
  const bg = variant === 'primary' ? t.primary : variant === 'secondary' ? t.button : 'transparent';
  const color = variant === 'primary' ? '#FFFFFF' : variant === 'link' ? t.primary : t.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          height: small ? 32 : 44,
          borderRadius: small ? 8 : 10,
          paddingHorizontal: small ? 14 : 16,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
          opacity: disabled ? 0.45 : pressed ? 0.7 : 1,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: t.border,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          {icon}
          <Text style={{ color, fontWeight: '600', fontSize: small ? 14 : 15 }}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export function IconButton({ onPress, children, style, hitSlop = 8 }: {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  hitSlop?: number;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={hitSlop} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }, style]}>
      {children}
    </Pressable>
  );
}

/* ---------------- Header ---------------- */

export function Header({ title, left, right, center, border = false, back = true }: {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  center?: ReactNode;
  border?: boolean;
  back?: boolean;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: t.bg,
        borderBottomWidth: border ? StyleSheet.hairlineWidth : 0,
        borderBottomColor: t.border,
      }}
    >
      <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
        <View style={{ minWidth: 40, flexDirection: 'row', alignItems: 'center' }}>
          {left ??
            (back && (
              <IconButton onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
                <BackIcon color={t.text} />
              </IconButton>
            ))}
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          {center ?? (
            <T weight="700" size={17} numberOfLines={1}>
              {title}
            </T>
          )}
        </View>
        <View style={{ minWidth: 40, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 18 }}>{right}</View>
      </View>
    </View>
  );
}

/* ---------------- Inputs ---------------- */

export function Input(props: TextInputProps) {
  const t = useTheme();
  return (
    <TextInput
      placeholderTextColor={t.textSecondary}
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      style={[
        {
          height: 48,
          borderRadius: 10,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: t.border,
          backgroundColor: t.dark ? t.elevated : '#FAFAFA',
          paddingHorizontal: 14,
          color: t.text,
          fontSize: 15,
        },
        props.style,
      ]}
    />
  );
}

export function SearchBar({ value, onChangeText, onFocus, autoFocus, placeholder = 'Search', style }: {
  value: string;
  onChangeText: (v: string) => void;
  onFocus?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', backgroundColor: t.input, borderRadius: 10, height: 38, paddingHorizontal: 10 }, style]}>
      <Ionicons name="search" size={17} color={t.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        autoFocus={autoFocus}
        placeholder={placeholder}
        placeholderTextColor={t.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ flex: 1, marginLeft: 8, color: t.text, fontSize: 16, paddingVertical: 0 }}
      />
      {value.length > 0 && (
        <IconButton onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={16} color={t.textSecondary} />
        </IconButton>
      )}
    </View>
  );
}

/* ---------------- Bottom sheet ---------------- */

export function Sheet({ visible, onClose, children, title }: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={{ flex: 1, backgroundColor: t.overlay }} onPress={onClose} />
      <View
        style={{
          backgroundColor: t.sheet,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingBottom: insets.bottom + 12,
          maxHeight: '85%',
        }}
      >
        <View style={{ alignItems: 'center', paddingVertical: 10 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: t.textSecondary, opacity: 0.5 }} />
        </View>
        {title && (
          <View style={{ alignItems: 'center', paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.border }}>
            <T weight="700" size={16}>
              {title}
            </T>
          </View>
        )}
        {children}
      </View>
    </Modal>
  );
}

export type SheetAction = { label: string; onPress: () => void; destructive?: boolean; icon?: keyof typeof Ionicons.glyphMap };

export function ActionSheet({ visible, onClose, actions }: { visible: boolean; onClose: () => void; actions: SheetAction[] }) {
  const t = useTheme();
  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={{ marginHorizontal: 16, borderRadius: 14, backgroundColor: t.dark ? '#363636' : '#F5F5F5', overflow: 'hidden' }}>
        {actions.map((a, i) => (
          <Pressable
            key={a.label}
            onPress={() => {
              onClose();
              setTimeout(a.onPress, 250);
            }}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingHorizontal: 16,
              paddingVertical: 15,
              backgroundColor: pressed ? t.border : 'transparent',
              borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth,
              borderTopColor: t.border,
            })}
          >
            {a.icon && <Ionicons name={a.icon} size={22} color={a.destructive ? t.like : t.text} />}
            <Text style={{ color: a.destructive ? t.like : t.text, fontSize: 16 }}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </Sheet>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: t.border }, style]} />;
}

export function Screen({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[{ flex: 1, backgroundColor: t.bg }, style]}>{children}</View>;
}

export function EmptyState({ icon, title, subtitle }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string }) {
  const t = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: t.text, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Ionicons name={icon} size={38} color={t.text} />
      </View>
      <T weight="700" size={24} style={{ textAlign: 'center' }}>
        {title}
      </T>
      {subtitle && (
        <T muted style={{ textAlign: 'center', marginTop: 8 }}>
          {subtitle}
        </T>
      )}
    </View>
  );
}
