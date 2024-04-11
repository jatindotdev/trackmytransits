import {
  BottomSheetHandle,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import type React from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { TextInput } from 'react-native';
import { useAnimatedKeyboard } from 'react-native-reanimated';
import {
  Input,
  Button,
  useTheme,
  Text,
  styled,
  View,
  ScrollView,
} from 'tamagui';
import { Form } from 'tamagui';

const NewTransit = (props: React.ComponentProps<typeof Button>) => {
  const router = useRouter();
  const onSubmit = () => {
    router.canGoBack() ? router.back() : router.push('/');
    console.log('Submitted');
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['92.5%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const theme = useTheme();

  return (
    <>
      <Button onPress={handlePresentModalPress} {...props}>
        New Transit
      </Button>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{
          backgroundColor: theme.background.get(),
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.color.get(),
        }}
        keyboardBehavior="interactive"
        backdropComponent={props => {
          return (
            <View
              {...props}
              style={{ backgroundColor: theme.background.get() }}
            />
          );
        }}
      >
        <BottomSheetView>
          <ScrollView
            contentContainerStyle={{
              ai: 'center',
              p: '$6',
              gap: '$6',
            }}
            automaticallyAdjustKeyboardInsets
          >
            <Text fontWeight="700" fontSize="$9">
              Transit Details
            </Text>
            <Form onSubmit={onSubmit} ai={'center'} w={'100%'} gap="$2.5">
              <Input placeholder="Company Name" w="100%" />
              <Input placeholder="Tracking ID" w="100%" />
              <Input placeholder="Shipping Company" w="100%" />
              <Input
                keyboardType="phone-pad"
                placeholder="Contact Number"
                w="100%"
              />
              <Input placeholder="Destination" w="100%" />
              <Input placeholder="Bill Number" w="100%" />
              <Input keyboardType="decimal-pad" placeholder="Amount" w="100%" />

              <Form.Trigger asChild>
                <Button bg={'$orange9'} mt="$5" color={'white'} w="100%">
                  Add Transit
                </Button>
              </Form.Trigger>
              <Button
                mt="$1"
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                }}
                bg="$red9"
                color="white"
                w="100%"
              >
                Cancel
              </Button>
            </Form>
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default NewTransit;
