import { formatTime } from '@/lib/utils';
import { ArrowRight } from '@tamagui/lucide-icons';
import { Button, ScrollView, Text, View } from 'tamagui';
import type { Transit } from '../transits/transit';
import {
  BottomSheet,
  BottomSheetTitle,
  useBottomSheetModal,
} from '../bottom-sheet/modal';
import { Link } from 'expo-router';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { mutate } from 'swr';
import type { Tables } from '@/types/supabase';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface TransitCardProps {
  transit: Tables<'transit'>;
}

const tallySchema = z.object({
  tallyEntryToGoods: z.boolean(),
  scanForEveryBill: z.boolean(),
  asPerBill: z.boolean(),
  onTheRecord: z.boolean(),
});

export function InventoryTransit({ transit }: TransitCardProps) {
  const sheetProps = useBottomSheetModal({
    snapPoints: ['60%', '75%'],
    onDismiss: () => console.log('onDismiss'),
    onPresent: () => console.log('onPresent'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tallySchema),
    defaultValues: {
      tallyEntryToGoods: transit.tally_entry_to_goods,
      scanForEveryBill: transit.scan_for_every_bill,
      asPerBill: transit.as_per_bill,
      onTheRecord: transit.on_the_record,
    },
  });

  const onSubmit = handleSubmit(async data => {
    const received =
      data.tallyEntryToGoods &&
      data.scanForEveryBill &&
      data.asPerBill &&
      data.onTheRecord;

    const { error } = await supabase
      .from('transit')
      .update({
        tally_entry_to_goods: data.tallyEntryToGoods,
        scan_for_every_bill: data.scanForEveryBill,
        as_per_bill: data.asPerBill,
        on_the_record: data.onTheRecord,
        received,
      })
      .eq('id', transit.id);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating tally',
        text2: error.message,
      });
      return;
    }

    mutate('inventory');

    Toast.show({
      type: 'success',
      text1: 'Tally updated',
    });

    sheetProps.dismiss();
  });

  const error = Object.values(errors)[0];

  return (
    <View w="100%" h="100%">
      <BottomSheetTitle centerTitle>{transit.company_name}</BottomSheetTitle>
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
        <View jc="space-between" ai="center" gap="$4" w="100%">
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
            w="100%"
            fd="row"
            gap="$2"
            bg="$color6"
            jc="space-between"
            ai="center"
            p="$4"
            borderRadius="$4"
          >
            <Text fontSize="$5" color="$color11">
              Contact
            </Text>
            <Link target="_blank" href={`tel:${transit.contact_number}`}>
              <Text fontSize="$6" color="$blue10">
                {transit.contact_number}
              </Text>
            </Link>
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
          <View gap="$2" bg="$color6" p="$4" borderRadius="$4">
            <View fd="row" w="100%" justifyContent="space-between">
              <Text color="$color11">On the Record</Text>
              <Text color="$color">{transit.on_the_record ? 'Yes' : 'No'}</Text>
            </View>
            <View fd="row" w="100%" justifyContent="space-between">
              <Text color="$color11">As Per Bill</Text>
              <Text color="$color">{transit.as_per_bill ? 'Yes' : 'No'}</Text>
            </View>
            <View fd="row" w="100%" justifyContent="space-between">
              <Text color="$color11">Scan for every bill</Text>
              <Text color="$color">
                {transit.scan_for_every_bill ? 'Yes' : 'No'}
              </Text>
            </View>
            <View fd="row" w="100%" justifyContent="space-between">
              <Text color="$color11">Tally entry to goods</Text>
              <Text color="$color">
                {transit.tally_entry_to_goods ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
          <View
            w="100%"
            fd="row"
            gap="$2"
            bg="$color6"
            jc="space-between"
            ai="center"
            p="$4"
            borderRadius="$4"
          >
            <Text fontSize="$5" color="$color11">
              Recieved
            </Text>
            <Text
              color={
                {
                  true: '$green10',
                  false: '$red10',
                }[transit.received ? 'true' : 'false']
              }
              fontSize="$6"
            >
              {transit.received ? 'Yes' : 'No'}
            </Text>
          </View>
          <Button
            fontSize="$5"
            bg="$purple10"
            onPress={sheetProps.present}
            w="100%"
            disabled={transit.received}
            opacity={transit.received ? 0.5 : 1}
          >
            Update Tally
          </Button>
          <BottomSheet {...sheetProps}>
            <View w="100%" h="100%">
              <BottomSheetTitle centerTitle>Update Tally</BottomSheetTitle>
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
                <Controller
                  control={control}
                  name="onTheRecord"
                  render={({ field }) => (
                    <Button
                      onPress={() => field.onChange(!field.value)}
                      bg={field.value ? '$green10' : '$color6'}
                      color={field.value ? 'white' : '$color'}
                      w="100%"
                      fontSize="$5"
                    >
                      On the record
                    </Button>
                  )}
                />
                <Controller
                  control={control}
                  name="asPerBill"
                  render={({ field }) => (
                    <Button
                      onPress={() => field.onChange(!field.value)}
                      bg={field.value ? '$green10' : '$color6'}
                      color={field.value ? 'white' : '$color'}
                      w="100%"
                      fontSize="$5"
                    >
                      As per bill
                    </Button>
                  )}
                />
                <Controller
                  control={control}
                  name="scanForEveryBill"
                  render={({ field }) => (
                    <Button
                      onPress={() => field.onChange(!field.value)}
                      bg={field.value ? '$green10' : '$color6'}
                      color={field.value ? 'white' : '$color'}
                      w="100%"
                      fontSize="$5"
                    >
                      Scan for every bill
                    </Button>
                  )}
                />
                <Controller
                  control={control}
                  name="tallyEntryToGoods"
                  render={({ field }) => (
                    <Button
                      onPress={() => field.onChange(!field.value)}
                      bg={field.value ? '$green10' : '$color6'}
                      color={field.value ? 'white' : '$color'}
                      w="100%"
                      fontSize="$5"
                    >
                      Tally entry to goods
                    </Button>
                  )}
                />
                {error && (
                  <Text color="$red10" textAlign="center">
                    {error.message}
                  </Text>
                )}
                <Button
                  onPress={onSubmit}
                  bg="$purple10"
                  w="100%"
                  fontSize="$5"
                >
                  Update
                </Button>
              </BottomSheetScrollView>
            </View>
          </BottomSheet>
        </View>
      </BottomSheetScrollView>
    </View>
  );
}