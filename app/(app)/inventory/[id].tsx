import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'tamagui';

export default function Inventory() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Transit {id}</Text>
    </View>
  );
}