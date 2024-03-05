import { Link, useNavigation, useRouter } from 'expo-router';
import { Button, Input, Text, View, Form } from 'tamagui';

export default function Incoming() {
  const navigation = useNavigation();
  const router = useRouter();
  const onSubmit = () => {
    router.canGoBack() ? router.back() : router.push('/');
    console.log('Submitted');
  };
  return (
    <View flex={1} gap="$8" bg="$backgroundStrong" p={'$6'}>
      <Text fontSize={18} fontWeight={'700'}>
        Company Name
      </Text>
      <View flexDirection="row" width={'100%'} gap={'$7'}>
        <Text fontSize={15} fontWeight={'500'}>
          Tracking ID
        </Text>
        <Text fontSize={15} fontWeight={'500'}>
          Shipping Company (i.a.)
        </Text>
      </View>
      <Text fontSize={15} fontWeight={'700'}>
        Current Status{' '}
      </Text>
      <Text fontSize={15} fontWeight={'500'}>
        Order Date
      </Text>
      <Text fontSize={15} fontWeight={'500'}>
        Destination{' '}
      </Text>
      <Text fontSize={15} fontWeight={'500'}>
        Contact Number{' '}
      </Text>

      <View flexDirection="row" width={'100%'} gap={'$4'}>
        <Text fontSize={15} fontWeight={'500'}>
          Bill Number //t
        </Text>
        <Text fontSize={15} fontWeight={'500'}>
          Ammount //t
        </Text>
      </View>
      <View width={'100%'} padding={6}>
        <Form onSubmit={onSubmit} ai={'center'} w={'100%'} gap="$2.5">
          <Input placeholder="Current Status" w="100%" />
          <Input placeholder="Location" w="100%" />

          <Form.Trigger asChild>
            <Button bg={'orange'} color={'black'} mt="$4">
              Update Status
            </Button>
          </Form.Trigger>
          <Button bg={'orange'} color={'black'} mt="$4">
            Reached
          </Button>
        </Form>
      </View>
    </View>
  );
}
