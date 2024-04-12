import { Link, Stack } from 'expo-router';
import { Text, View } from 'tamagui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View flex={1} ai="center" jc="center" p={20}>
        <Text fontSize="$6" fontWeight="700">
          This screen doesn't exist.
        </Text>
        <Link href="/(app)/" asChild>
          <Text fontSize="$4" color="#2e78b7" mt={'$4'}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}
