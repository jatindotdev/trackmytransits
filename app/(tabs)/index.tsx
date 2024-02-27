import { StyleSheet } from 'react-native';

import { Link } from 'expo-router';
import { Button, Text, View } from 'tamagui';

export default function TabOneScreen() {
  return (
    <View style={styles.container} backgroundColor="$backgroundStrong">
      <Text style={styles.title}>Tab One</Text>
      <Button>Change to light mode</Button>
      <Link href="/modal" asChild>
        <Button>Go to Modal</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
