import { formatTime } from '@/lib/utils';
import type { Tables } from '@/types/supabase';
import { ArrowRight } from '@tamagui/lucide-icons';
import { View, Text } from 'tamagui';

interface TransitCardProps {
  transit: Tables<'transit'>;
  presentModal: () => void;
}

export const TransitCard = ({ transit, presentModal }: TransitCardProps) => {
  return (
    <View onPress={presentModal} bg="$background" p="$4" w="100%">
      <View jc="space-between" gap="$2" w="100%">
        <Text fontSize="$5" fontWeight="700">
          {transit.company_name}
        </Text>
        <View gap="$2">
          <View fd="row" w="100%" justifyContent="space-between">
            <Text color="$gray9">
              {transit.reached_destination ? 'Reached' : 'In Transit'}
            </Text>
            <Text color="$gray9">#{transit.tracking_id}</Text>
          </View>
          <View fd="row" w="100%" justifyContent="space-between">
            <Text color="$gray9">Billed on</Text>
            <Text color="$gray9">
              {formatTime(new Date(transit.billing_date))}
            </Text>
          </View>
          <View
            mt="$2"
            pos="relative"
            fd="row"
            ai="center"
            justifyContent="space-between"
          >
            <Text
              textOverflow="ellipsis"
              w="45%"
              numberOfLines={1}
              fontSize={16}
              color="$gray11"
            >
              {transit.origin}
            </Text>
            <ArrowRight
              pos="absolute"
              left="50%"
              right="50%"
              transform={[{ translateX: -10 }]}
              size={20}
              color="$gray9"
            />
            <Text
              numberOfLines={1}
              w="45%"
              textAlign="right"
              fontSize={16}
              color="$gray11"
            >
              {transit.destination}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
