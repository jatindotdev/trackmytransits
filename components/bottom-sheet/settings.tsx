import { useFormState } from '@/hooks/useFormState';
import { BottomSheet, BottomSheetTitle, useBottomSheetModal } from './modal';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { Pressable } from 'react-native';
import { Settings } from '@tamagui/lucide-icons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Button, Text } from 'tamagui';
import type { Tables } from '@/types/supabase';

interface SettingsSheetProps {
  user: Tables<'users'>;
}

export const SettingsSheet = ({ user }: SettingsSheetProps) => {
  const settingSheet = useBottomSheetModal({
    snapPoints: ['50%'],
    onDismiss: () => console.log('onDismiss'),
    onPresent: () => console.log('onPresent'),
  });

  const { formState, setFormState } = useFormState();

  const signOut = async () => {
    setFormState('loading');

    const { error } = await supabase.auth.signOut();

    setFormState(error ? 'error' : 'idle');

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error signing out',
        text2: error.message,
      });
      return;
    }

    settingSheet.dismiss();
  };

  return (
    <>
      <Pressable>
        {({ pressed }) => (
          <Settings
            opacity={pressed ? 0.5 : 1}
            size={24}
            style={{
              marginRight: 16,
            }}
            onPress={settingSheet.present}
          />
        )}
      </Pressable>
      <BottomSheet {...settingSheet}>
        <BottomSheetTitle centerTitle>Settings</BottomSheetTitle>
        <BottomSheetScrollView
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            gap: 20,
            width: '100%',
          }}
          style={{ height: '100%' }}
        >
          <Text textAlign="center" fontSize="$6" mb="$2">
            {user.email}
          </Text>
          <Text textAlign="center" fontSize="$6" mb="$2">
            ({user.role})
          </Text>
          <Button mt="$4" bg="$red8" fontSize="$5" onPress={signOut}>
            {
              {
                idle: 'Sign Out',
                loading: 'Signing Out...',
                error: 'Sign Out',
              }[formState]
            }
          </Button>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
};