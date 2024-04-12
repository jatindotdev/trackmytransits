import { useSession } from '@/lib/ctx';
import { supabase } from '@/lib/supabase';
import { Stack, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button, View } from 'tamagui';

export default function ModalScreen() {
  const navigation = useNavigation();

  return (
    <View flex={1} ai="center" jc="center" bg="$backgroundStrong" gap={'$2'}>
      <Button
        onPress={async () => {
          await supabase.auth.signOut();

          Toast.show({
            type: 'success',
            text1: 'Signed out.',
          });
        }}
      >
        Sign out
      </Button>

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
