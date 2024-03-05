import { Link } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import { Text, View } from 'tamagui';

const IncomingTansits = () => {
  return (
    <Link href="/(incoming)/incoming">
      <View
        w={'100%'}
        p={'$4'}
        height={'auto'}
        justifyContent="space-between"
        backgroundColor={'$orange7'}
        borderRadius={10}
      >
        <View flexDirection="row" width={'100%'} justifyContent="space-between">
          <Text fontSize={17} fontWeight={'700'} paddingBottom={7}>
            {' '}
            Company Name
          </Text>
          <Text fontSize={13} fontWeight={'500'}>
            {' '}
            Tracking ID
          </Text>
        </View>
        <View flexDirection="row" width={'100%'} justifyContent="space-between">
          <Text fontSize={13} fontWeight={'500'} paddingBottom={7}>
            {' '}
            Order Date{' '}
          </Text>
          <Text fontSize={13} fontWeight={'500'}>
            {' '}
            Destination{' '}
          </Text>
        </View>
        <Text fontSize={14} fontWeight={'700'}>
          {' '}
          Current Status
        </Text>
      </View>
    </Link>
  );
};

export default IncomingTansits;
