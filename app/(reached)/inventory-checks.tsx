import { Link, useNavigation, useRouter } from 'expo-router';
import { Button, Input, Text, View, Form, Checkbox, ScrollView } from 'tamagui';
import { Check as CheckIcon } from '@tamagui/lucide-icons';
import type { CheckboxProps, SizeTokens } from 'tamagui';
import { Label, XStack, YStack } from 'tamagui';

export default function InventoryChecks() {
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
          <YStack width={300} alignItems="center" space="$2">
            <CheckboxWithLabel size="$4" label="Check as per bill" />
            <CheckboxWithLabel size="$4" label="match with tally" />
            <CheckboxWithLabel size="$4" label="scan for every bill done" />
            <CheckboxWithLabel
              size="$4"
              label="Check if on paper and off paper records entered"
            />
          </YStack>
          <Form.Trigger asChild>
            <Button bg={'orange'} color={'black'} mt="$4">
              Update Status
            </Button>
          </Form.Trigger>
          <Button bg={'orange'} color={'black'} mt="$4">
            Added goods to inventory
          </Button>
        </Form>
      </View>
    </View>
  );
}

export function CheckboxWithLabel({
  size,
  label = 'Accept terms and conditions',
  ...checkboxProps
}: CheckboxProps & { size: SizeTokens; label?: string }) {
  const id = `checkbox-${size.toString().slice(1)}`;
  return (
    <XStack width={300} alignItems="center" space="$4">
      <Checkbox id={id} size={size} {...checkboxProps}>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  );
}
