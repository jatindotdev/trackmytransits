import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Input,
  Button,
  useTheme,
  Text,
  View,
  ScrollView,
  Dialog,
} from 'tamagui';
import { Form } from 'tamagui';
import DatePicker from 'react-native-modern-datepicker';
import { formatTime } from '@/lib/utils';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { mutate } from 'swr';
import { BottomSheetTitle } from '../bottom-sheet/modal';

const newTransitSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  billingDate: z.date({
    required_error: 'Billing date is required.',
  }),
  trackingId: z.string().min(1, 'Tracking ID is required.'),
  shippingCompany: z.string().min(1, 'Shipping company is required.'),
  contactNumber: z
    .string({
      required_error: 'Contact number is required.',
    })
    .min(10, 'Enter a valid contact number.'),
  origin: z.string().min(1, 'Origin is required.'),
  destination: z.string().min(1, 'Destination is required.'),
});

const NewTransit = (props: React.ComponentProps<typeof Button>) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['92.5%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'loading'>('idle');
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newTransitSchema),
    defaultValues: {
      companyName: '',
      billingDate: new Date(),
      trackingId: '',
      shippingCompany: '',
      contactNumber: '',
      origin: '',
      destination: '',
    },
  });

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        reset();
      }
    },
    [reset]
  );

  const onSubmit = handleSubmit(async values => {
    setFormState('loading');

    const { error } = await supabase.from('transit').insert({
      company_name: values.companyName,
      billing_date: values.billingDate.toISOString(),
      tracking_id: values.trackingId,
      shipping_company: values.shippingCompany,
      contact_number: values.contactNumber,
      origin: values.origin,
      destination: values.destination,
    });

    setFormState('idle');

    if (error) {
      Toast.show({
        text1: 'Failed to add transit.',
        text2: error.message,
        type: 'error',
      });
      return;
    }

    mutate('inventory');
    mutate('transits');

    Toast.show({
      text1: 'Transit added successfully.',
      type: 'success',
    });

    bottomSheetModalRef.current?.close();
  });

  const error = Object.values(errors)[0];

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
          shadowColor: theme.backgroundStrong.get(),
          shadowOpacity: 0.2,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.color.get(),
        }}
        keyboardBehavior="interactive"
      >
        <BottomSheetView>
          <BottomSheetTitle centerTitle>New Transit</BottomSheetTitle>
          <ScrollView
            contentContainerStyle={{
              ai: 'center',
              p: '$4',
              gap: '$6',
            }}
            automaticallyAdjustKeyboardInsets
          >
            <View ai={'center'} w={'100%'} gap="$2.5">
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value, disabled } }) => (
                  <Input
                    w="100%"
                    placeholder="Company Name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    editable={!disabled}
                  />
                )}
                name="companyName"
              />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger asChild>
                      <Input
                        placeholder="Date"
                        w="100%"
                        editable={false}
                        value={formatTime(value)}
                      />
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay
                        key="overlay"
                        animation="slow"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                      />
                      <Dialog.Content
                        bordered
                        elevate
                        key="content"
                        animateOnly={['transform', 'opacity']}
                        animation={[
                          'quick',
                          {
                            opacity: {
                              overshootClamping: true,
                            },
                          },
                        ]}
                        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                        gap="$4"
                        w="90%"
                        ai="center"
                      >
                        <DatePicker
                          current={value.toISOString()}
                          options={{
                            backgroundColor: theme.background.get(),
                            textDefaultColor: theme.color.get(),
                            textHeaderColor: theme.color.get(),
                            selectedTextColor: theme.color.get(),
                            mainColor: theme.purple10.get(),
                          }}
                          onSelectedChange={date => {
                            const selectedDate = new Date(
                              date.replaceAll('/', '-').replace(' ', 'T')
                            );
                            onChange(selectedDate);
                            setOpen(false);
                          }}
                          mode="datepicker"
                          style={{ backgroundColor: theme.background.get() }}
                        />
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog>
                )}
                name="billingDate"
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    w="100%"
                    placeholder="Tracking ID"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
                name="trackingId"
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    w="100%"
                    placeholder="Shipping Company"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
                name="shippingCompany"
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    w="100%"
                    keyboardType="phone-pad"
                    placeholder="Contact Number"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
                name="contactNumber"
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    w="100%"
                    placeholder="Origin"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
                name="origin"
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    w="100%"
                    placeholder="Destination"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
                name="destination"
              />
              {error && <Text color="$red9">{error.message}</Text>}
              <Button
                mt="$4"
                onPress={onSubmit}
                bg={'$purple10'}
                color={'white'}
                w="100%"
                disabled={formState === 'loading'}
              >
                {
                  {
                    idle: 'Add Transit',
                    loading: 'Adding Transit...',
                  }[formState]
                }
              </Button>
              <Button
                mt="$1"
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                }}
                color="white"
                w="100%"
                disabled={formState === 'loading'}
              >
                Cancel
              </Button>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default NewTransit;
