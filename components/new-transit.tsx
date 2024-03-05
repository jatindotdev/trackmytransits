import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';
import { View, Input, Button, Text } from 'tamagui';
import { Form } from 'tamagui';
const NewTransit = () => {
  const router = useRouter();
  const onSubmit = () => {
    router.canGoBack() ? router.back() : router.push('/');
    console.log('Submitted');
  };
  return (
    <View jc={'center'} ai={'center'} flex={1} p="$6">
      
      <Form onSubmit={onSubmit} ai={'center'} w={'100%'} gap="$2.5">
        <Input placeholder="Company Name" w="100%" />
        <Input placeholder="Tracking ID" w="100%" />
        <Input placeholder="Shipping Company" w="100%" />
        <Input placeholder="Contact Number" w="100%" />
        <Input placeholder="Destination" w="100%" />
        <Input placeholder="Bill Number" w="100%" />
        <Input placeholder="Ammount" w="100%" />

        <Form.Trigger asChild>
          <Button bg={'orange'} color={'black'} mt="$4">
            Add new Transit
          </Button>
        </Form.Trigger>
      </Form>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
};

export default NewTransit;
