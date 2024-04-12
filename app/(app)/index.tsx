import { useSession } from '@/lib/ctx';
import { Redirect, router } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Text, View, useTheme } from 'tamagui';

export default function Index() {
  const { user, isLoading } = useSession();
  const theme = useTheme();

  if (isLoading) {
    return (
      <View flex={1} ai="center" jc="center">
        <ActivityIndicator size="large" color={theme.color.get()} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  console.log('user', user);

  if (user.role === 'admin') {
    return <Redirect href="/(app)/(admin)/transits" />;
  }

  if (user.role === 'receptionist') {
    return <Redirect href="/(app)/(receptionist)/transits" />;
  }

  if (user.role === 'worker') {
    return <Redirect href="/(app)/(worker)/inventory" />;
  }

  return (
    <View flex={1} ai="center" jc="center">
      <Text>Unknown role: {user.role}</Text>
    </View>
  );
}