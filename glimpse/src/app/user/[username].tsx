import { useLocalSearchParams } from 'expo-router';

import { ProfileView } from '@/components/ProfileView';
import { EmptyState, Header, Screen } from '@/components/ui';
import { useStore } from '@/store';

export default function UserProfile() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const user = useStore((s) => s.users.find((u) => u.username === username));
  const meId = useStore((s) => s.currentUserId);

  if (!user) {
    return (
      <Screen>
        <Header title="" />
        <EmptyState icon="person-outline" title="Sorry, this page isn't available." subtitle="The link may be broken, or the profile may have been removed." />
      </Screen>
    );
  }
  return <ProfileView user={user} isMe={user.id === meId} />;
}
