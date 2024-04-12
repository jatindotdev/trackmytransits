import {
  BottomSheet,
  BottomSheetTitle,
  useBottomSheetModal,
} from '@/components/bottom-sheet/modal';
import { supabase } from '@/lib/supabase';
import { formatTime } from '@/lib/utils';
import type { Tables } from '@/types/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { mutate } from 'swr';
import { View, Text, ScrollView, Button, Input } from 'tamagui';
import { object, z } from 'zod';

export type Transit = Tables<'transit'> & {
  status: Tables<'status'>[];
  container: Tables<'container'>[];
};

interface TransitProps {
  transit: Transit;
}

export function TransitPage({ transit }: TransitProps) {
  return (
    <View w="100%" h="100%">
      <BottomSheetTitle centerTitle>{transit.company_name}</BottomSheetTitle>
      <ScrollView w="100%" h="100%">
        <View jc="space-between" mb="$20" ai="center" p="$4" gap="$4" w="100%">
          <View gap="$2" bg="$color6" p="$4" borderRadius="$4">
            <View fd="row" w="100%" justifyContent="space-between">
              <Text color="$color11">
                {transit.reached_destination ? 'Reached' : 'In Transit'}
              </Text>
              <Text color="$color">#{transit.tracking_id}</Text>
            </View>
            <View fd="row" w="100%" justifyContent="space-between">
              <Text color="$color11">Billed on</Text>
              <Text color="$color">
                {formatTime(new Date(transit.billing_date))}
              </Text>
            </View>

            <View fd="row" ai="flex-end" gap="$2" jc="space-between">
              <Text textOverflow="ellipsis" w="45%" color="$color11">
                Shipping Company
              </Text>
              <Text
                textOverflow="ellipsis"
                w="45%"
                textAlign="right"
                fontSize="$6"
                color="$color"
              >
                {transit.shipping_company}
              </Text>
            </View>
          </View>
          <View
            borderRadius="$4"
            fd="row"
            bg="$color6"
            jc="center"
            ai="center"
            w="100%"
            py="$4"
          >
            <View
              pos="relative"
              fd="row"
              ai="center"
              justifyContent="space-between"
            >
              <Text
                textOverflow="ellipsis"
                w="45%"
                textAlign="left"
                numberOfLines={1}
                fontSize={16}
                color="$color"
              >
                {transit.origin}
              </Text>
              <ArrowRight
                pos="absolute"
                left="50%"
                right="50%"
                transform={[{ translateX: -10 }]}
                size={20}
                color="$color"
              />
              <Text
                numberOfLines={1}
                w="45%"
                textAlign="right"
                fontSize={16}
                color="$color"
              >
                {transit.destination}
              </Text>
            </View>
          </View>

          <Text fontWeight="500" fontSize="$6" color="$color">
            Container Details
          </Text>
          {!transit.container.length && (
            <Text color="$color11" fontSize="$5">
              No containers attached.
            </Text>
          )}
          {transit.container.map(container => (
            <View
              key={container.id}
              bg="$color6"
              p="$4"
              borderRadius="$4"
              gap="$2"
              w="100%"
            >
              <View fd="row" w="100%" justifyContent="space-between">
                <Text color="$color11">Container Id</Text>
                <Text fontSize="$5" color="$color">
                  #{container.id}
                </Text>
              </View>
              <View fd="row" w="100%" justifyContent="space-between">
                <Text color="$color11">Bill</Text>
                <Text fontSize="$5" color="$color">
                  {container.bill_number}
                </Text>
              </View>
              <View fd="row" w="100%" justifyContent="space-between">
                <Text color="$color11">Amount</Text>
                <Text fontSize="$5" color="$color">
                  {container.amount}
                </Text>
              </View>
            </View>
          ))}
          <Text fontWeight="500" fontSize="$6" color="$color">
            Transit Status
          </Text>
          {!transit.status.length && (
            <Text color="$color11" fontSize="$5">
              No status updates.
            </Text>
          )}
          {transit.status.map(status => (
            <View
              key={status.id}
              bg="$color6"
              p="$4"
              ai="center"
              borderRadius="$4"
              gap="$2"
              w="100%"
            >
              <View fd="row" w="100%" justifyContent="space-between">
                <Text color="$color11">Time</Text>
                <Text
                  textAlign="right"
                  textOverflow="ellipsis"
                  w="60%"
                  color="$color"
                >
                  {formatTime(new Date(status.timestamp))}
                </Text>
              </View>
              <View fd="row" w="100%" justifyContent="space-between">
                <Text color="$color11">Location</Text>
                <Text
                  textAlign="right"
                  textOverflow="ellipsis"
                  w="60%"
                  fontSize="$5"
                  color="$color"
                  fontWeight="500"
                >
                  {status.location}
                </Text>
              </View>
              <Text textAlign="left" w="100%" color="$color11">
                Status
              </Text>
              <Text fontSize="$5" w="100%" color="$color">
                {status.remark}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View
        pos="absolute"
        b="$0"
        fd="row"
        gap="$3"
        p="$4"
        borderRadius="$8"
        shadowColor="$color4"
        shadowOpacity={0.5}
        shadowRadius={3}
        pt="$6"
        pb="$8"
        ai="center"
        jc="center"
        bg="$background"
        w="100%"
        flexWrap="wrap"
      >
        <AddContainer id={transit.id} delivered={transit.reached_destination} />
        <AddStatus id={transit.id} delivered={transit.reached_destination} />
        <MarkAsDelivered
          id={transit.id}
          delivered={transit.reached_destination}
        />
      </View>
    </View>
  );
}

export function MarkAsDelivered({
  id,
  delivered,
}: { id: number; delivered: boolean }) {
  const [loading, setLoading] = useState(false);

  const markAsDelivered = async () => {
    setLoading(true);

    const { error } = await supabase
      .from('transit')
      .update({
        reached_destination: true,
      })
      .eq('id', id);

    setLoading(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error marking transit as delivered',
        text2: error.message,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Transit marked as delivered',
    });

    mutate('transits');
    mutate('inventory');
  };

  return (
    <Button
      bg="$green10"
      shadowColor="$shadowColor"
      onPress={markAsDelivered}
      disabled={loading || delivered}
      disabledStyle={{ opacity: 0.5 }}
    >
      {delivered
        ? 'Already Delivered'
        : loading
          ? 'Marking as delivered...'
          : 'Mark as Delivered'}
    </Button>
  );
}

const addContainerSchema = z.object({
  billNumber: z.string().min(1, 'Bill Number is required'),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
    })
    .min(1, 'Amount must be greater than 0'),
});

export function AddContainer({
  id,
  delivered,
}: { id: number; delivered: boolean }) {
  const sheetProps = useBottomSheetModal({
    snapPoints: ['60%', '92.5%'],
    onDismiss: () => console.log('onDismiss'),
    onPresent: () => console.log('onPresent'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      billNumber: '',
      amount: 0,
    },
    resolver: zodResolver(addContainerSchema),
  });

  const [formState, setFormState] = useState<'idle' | 'loading'>('idle');

  const error = Object.values(errors)[0];

  const addContainer = handleSubmit(async data => {
    setFormState('loading');

    const { error } = await supabase.from('container').insert({
      bill_number: data.billNumber,
      amount: data.amount,
      transit_id: id,
    });

    setFormState('idle');

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error adding container',
        text2: error.message,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Container added',
    });

    mutate('transits');

    sheetProps.dismiss();
  });

  return (
    <>
      <Button
        bg="$orange9"
        shadowColor="$shadowColor"
        onPress={sheetProps.present}
        disabled={delivered}
        disabledStyle={{ opacity: 0.5 }}
      >
        Add Container
      </Button>
      <BottomSheet {...sheetProps}>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: '$4',
            gap: '$3',
          }}
          h="100%"
          automaticallyAdjustKeyboardInsets
        >
          <View ai="center" gap="$1">
            <Text fontSize="$6" fontWeight="700">
              Add Container
            </Text>
            <Text fontSize="$5" color="$color11">
              Add container details to the transit.
            </Text>
          </View>

          <View w="100%" gap="$2" mt="$6">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value, disabled } }) => (
                <Input
                  placeholder="Bill Number"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  disabled={disabled}
                />
              )}
              name="billNumber"
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value, disabled } }) => (
                <Input
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={value.toString()}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  disabled={disabled}
                />
              )}
              name="amount"
            />
          </View>

          {error && <Text color="$red9">{error.message}</Text>}

          <Button
            bg="$green10"
            mt="$2"
            w="100%"
            shadowColor="$shadowColor"
            onPress={addContainer}
            disabled={formState === 'loading'}
          >
            {formState === 'loading' ? 'Adding Container...' : 'Add Container'}
          </Button>
        </ScrollView>
      </BottomSheet>
    </>
  );
}

const addStatusSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  remark: z.string().min(1, 'Remark is required'),
});

export function AddStatus({
  id,
  delivered,
}: { id: number; delivered: boolean }) {
  const sheetProps = useBottomSheetModal({
    snapPoints: ['60%', '92.5%'],
    onDismiss: () => console.log('onDismiss'),
    onPresent: () => console.log('onPresent'),
  });

  const [formState, setFormState] = useState<'idle' | 'loading'>('idle');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: '',
      remark: '',
    },
    resolver: zodResolver(addStatusSchema),
  });

  const error = Object.values(errors)[0];

  const addStatus = handleSubmit(async data => {
    setFormState('loading');

    const { error } = await supabase.from('status').insert({
      location: data.location,
      remark: data.remark,
      transit_id: id,
    });

    setFormState('idle');

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error adding status',
        text2: error.message,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Status added',
    });

    mutate('transits');

    sheetProps.dismiss();
  });

  return (
    <>
      <Button
        bg="$purple10"
        shadowColor="$shadowColor"
        onPress={sheetProps.present}
        disabled={delivered}
        disabledStyle={{ opacity: 0.5 }}
      >
        Add Status
      </Button>
      <BottomSheet {...sheetProps}>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: '$4',
            gap: '$3',
          }}
          h="100%"
          automaticallyAdjustKeyboardInsets
        >
          <View ai="center" gap="$1">
            <Text fontSize="$6" fontWeight="700">
              Add Status
            </Text>
            <Text fontSize="$5" color="$color11">
              Add status details to the transit.
            </Text>
          </View>

          <View w="100%" gap="$2" mt="$6">
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value, disabled } }) => (
                <Input
                  placeholder="Location"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  disabled={disabled}
                />
              )}
              name="location"
            />

            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value, disabled } }) => (
                <Input
                  placeholder="Remark"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  disabled={disabled}
                />
              )}
              name="remark"
            />
          </View>

          {error && <Text color="$red9">{error.message}</Text>}

          <Button
            bg="$purple10"
            mt="$2"
            w="100%"
            shadowColor="$shadowColor"
            onPress={addStatus}
            disabled={formState === 'loading'}
          >
            {formState === 'loading' ? 'Adding Status...' : 'Add Status'}
          </Button>
        </ScrollView>
      </BottomSheet>
    </>
  );
}