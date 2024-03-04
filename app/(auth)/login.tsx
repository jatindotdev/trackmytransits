import { Link, useNavigation } from 'expo-router';
import { Button, Input, Text, View } from 'tamagui';

export default function LoginScreen() {
  const navigation = useNavigation();

  return (
    <View flex={1} ai="center" jc="center" gap="$3.5" bg="$backgroundStrong">
      <View ai="center" jc="center" pb={'$5'}>
        <Text fontSize={22} fontWeight={'800'}>
          Shiv Shakti
        </Text>
      </View>

      <Input placeholder="Username" width={'$19'} />
      <Input
        placeholder="Password"
        width={'$19'}
        secureTextEntry={true}
        mb={10}
      />
      <Link href="/" asChild>
        <Button width={'$19'} backgroundColor={'$orange8'}>
          Continue
        </Button>
      </Link>

      {/* <Button
        onPress={() => {
          navigation.goBack();
        }}
      >
        Go back
      </Button> */}
    </View>
  );
}
