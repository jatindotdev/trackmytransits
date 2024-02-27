import { StyleSheet } from 'react-native';

import { Text, View } from 'tamagui';

export default function TabOneScreen() {
  return (
    <View style={styles.container} backgroundColor="$backgroundStrong">
      <Text style={styles.title}>Tab Two</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
