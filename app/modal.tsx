import { Stack, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { Button, View } from 'tamagui';

export default function ModalScreen() {
  const navigation = useNavigation();

  return (
    <View flex={1} ai="center" jc="center" bg="$backgroundStrong" gap={'$2'}>
      <Button
        onPress={() => {
          navigation.goBack();
        }}
      >
        Go back
      </Button>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
