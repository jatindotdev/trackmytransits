import { Link } from 'expo-router';
import { View, Text } from 'tamagui';

export interface Transit {
  id: number;
  name: string;
  trackingId: string;
  shippingCompany: string;
  contactNumber: string;
  destination: string;
  status: string;
  eta: string;
}

interface TransitProps {
  transit: Transit;
}

export const Transit = ({ transit }: TransitProps) => {
  return (
    <Link href="/(incoming)/incoming" asChild>
      <View bg="$background" p="$4" w="100%">
        <View fd="row" jc="space-between" ai="center">
          <View>
            <View fd="row" ai="center">
              <Text>{transit.name}</Text>
              <Text color="$gray7" ml="$2">
                {transit.status}
              </Text>
            </View>
            <Text color="$gray7">{transit.trackingId}</Text>
          </View>
          <Text>{transit.eta}</Text>
        </View>
      </View>
    </Link>
  );
};