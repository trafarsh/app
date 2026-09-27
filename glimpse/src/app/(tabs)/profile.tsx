import { ProfileView } from '@/components/ProfileView';
import { useMe } from '@/store';

export default function MyProfile() {
  const me = useMe();
  if (!me) return null;
  return <ProfileView user={me} isMe />;
}
