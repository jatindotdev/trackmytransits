import { Link } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import { Text, View } from 'tamagui';

const IncomingTansits = () => {
  return (
    <View w={'100%'} p={'$4'}>
      <Link href="/(reached)/inventory-checks">
        <View
          w={'100%'}
          p={'$4'}
          height={'auto'}
          justifyContent="space-between"
          backgroundColor={'$orange7'}
          borderRadius={10}
        >
          <View
            flexDirection="row"
            width={'100%'}
            justifyContent="space-between"
          >
            <Text fontSize={17} fontWeight={'700'} paddingBottom={7}>
              {' '}
              Company Name
            </Text>
            <Text fontSize={13} fontWeight={'500'}>
              {' '}
              Tracking ID
            </Text>
          </View>
          <View
            flexDirection="row"
            width={'100%'}
            justifyContent="space-between"
          >
            <Text fontSize={13} fontWeight={'500'} paddingBottom={7}>
              {' '}
              Reach Date
            </Text>
            <Text fontSize={13} fontWeight={'500'}>
              {' '}
              Destination{' '}
            </Text>
          </View>
        </View>
      </Link>
    </View>
  );
};

export default IncomingTansits;
