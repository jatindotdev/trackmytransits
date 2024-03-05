import { Link, Stack, useRouter } from 'expo-router';
import { Button, Text, View } from 'tamagui';
import { useState } from 'react';
import { Modal } from 'react-native';
import NewTransit from '../../components/new-transit';
import IncomingTansits from '@/components/incoming-tansits';
export default function TabOneScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <View flex={1} ai="center"  gap="$3.5" bg="$backgroundStrong">
      <View p={'$4'} w={'100%'}>
        <IncomingTansits />
      </View>
      <Button
        pos="absolute"
        bottom={20}
        right={20}
        bg="orange"
        ai="center"
        jc="center"
        onPress={() => setIsModalVisible(!isModalVisible)}
      >
        New Transit
      </Button>
      <Modal
        visible={isModalVisible}
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <NewTransit />
      </Modal>
    </View>
  );
}
