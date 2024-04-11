import { View, Text } from 'tamagui';
import NewTransit from '@/components/transits/new-transit';
import { useState } from 'react';
import { Transit } from '@/components/transits/transit';

export default function TabOneScreen() {
  const [transits, setTransits] = useState<Transit[]>([
    {
      id: 1,
      name: 'Transit 1',
      trackingId: '123456',
      shippingCompany: 'FedEx',
      contactNumber: '1234567890',
      destination: 'New York',
      status: 'In Transit',
      eta: '2022-01-01',
    },
  ]);

  return (
    <View flex={1} ai="center" py="$4" gap="$3.5" bg="$backgroundStrong">
      {transits.map(transit => (
        <Transit key={transit.id} transit={transit} />
      ))}

      <NewTransit bg="$orange9" color="white" pos="absolute" b="$4" r="$4" />
    </View>
  );
}
