import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path, Rect } from 'react-native-svg';

type P = { size?: number; color: string };

export const HomeIcon = ({ size = 26, color, active }: P & { active?: boolean }) => (
  <Ionicons name={active ? 'home' : 'home-outline'} size={size} color={color} />
);
export const SearchIcon = ({ size = 26, color, active }: P & { active?: boolean }) => (
  <Ionicons name={active ? 'search' : 'search-outline'} size={size} color={color} />
);
export const CreateIcon = ({ size = 26, color }: P) => <Feather name="plus-square" size={size - 2} color={color} />;
export const HeartIcon = ({ size = 26, color, filled }: P & { filled?: boolean }) =>
  filled ? <Ionicons name="heart" size={size + 2} color={color} /> : <Feather name="heart" size={size - 1} color={color} />;
export const CommentIcon = ({ size = 26, color }: P) => (
  <Feather name="message-circle" size={size - 1} color={color} style={{ transform: [{ scaleX: -1 }] }} />
);
export const ShareIcon = ({ size = 26, color }: P) => <Feather name="send" size={size - 3} color={color} />;
export const BookmarkIcon = ({ size = 26, color, filled }: P & { filled?: boolean }) =>
  filled ? <Ionicons name="bookmark" size={size - 2} color={color} /> : <Feather name="bookmark" size={size - 2} color={color} />;
export const MoreIcon = ({ size = 20, color }: P) => <Ionicons name="ellipsis-horizontal" size={size} color={color} />;
export const BackIcon = ({ size = 28, color }: P) => <Ionicons name="chevron-back" size={size} color={color} />;
export const CloseIcon = ({ size = 28, color }: P) => <Ionicons name="close" size={size} color={color} />;
export const VerifiedBadge = ({ size = 13 }: { size?: number }) => (
  <MaterialCommunityIcons name="check-decagram" size={size} color="#0095F6" style={{ marginLeft: 3 }} />
);

/** Reels "clapperboard with play" icon. When active it's filled and the details are cut out in `bg`. */
export const ReelsIcon = ({ size = 26, color, active, bg = '#FFFFFF' }: P & { active?: boolean; bg?: string }) => {
  const detail = active ? bg : color;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={2} y={2} width={20} height={20} rx={5} fill={active ? color : 'none'} stroke={color} strokeWidth={2} />
      <Path d="M2.5 7.5h19M7 2.5l3 5M13 2.5l3 5" stroke={detail} strokeWidth={2} fill="none" />
      <Path d="M9.8 11.2v6.2a.6.6 0 0 0 .9.5l5-3.1a.6.6 0 0 0 0-1l-5-3.1a.6.6 0 0 0-.9.5Z" fill={detail} />
    </Svg>
  );
};

export const MessengerIcon = ({ size = 26, color }: P) => <Feather name="send" size={size - 3} color={color} />;
