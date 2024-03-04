import { Link } from 'expo-router';
import { Button, Text, View } from 'tamagui';

export default function TabOneScreen() {
  return (
    <View flex={1} ai="center" jc="center" gap="$3.5" bg="$backgroundStrong">
      <Text fontSize={20} fontWeight="700">
        Tab One
      </Text>
      <Link href="/modal" asChild>
        <Button>Go to Modal</Button>
      </Link>

      <Link href="/login" asChild>
        <Button>Go to login</Button>
      </Link>
    </View>
  );
}
