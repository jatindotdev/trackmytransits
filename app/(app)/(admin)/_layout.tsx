import React from 'react';
import { Tabs } from 'expo-router';
import { ActivityIndicator, Pressable } from 'react-native';

import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';
import { Code2, Settings } from '@tamagui/lucide-icons';
import {
  BottomSheet,
  BottomSheetTitle,
  useBottomSheetModal,
} from '@/components/bottom-sheet/modal';
import { Button, ScrollView, Text, View, useTheme } from 'tamagui';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { useFormState } from '@/hooks/useFormState';
import { useSession } from '@/lib/ctx';
import { SettingsSheet } from '@/components/bottom-sheet/settings';

export default function TabLayout() {
  const settingSheet = useBottomSheetModal({
    snapPoints: ['50%'],
    onDismiss: () => console.log('onDismiss'),
    onPresent: () => console.log('onPresent'),
  });

  const { formState, setFormState } = useFormState();

  const signOut = async () => {
    setFormState('loading');

    const { error } = await supabase.auth.signOut();

    setFormState(error ? 'error' : 'idle');

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error signing out',
        text2: error.message,
      });
      return;
    }

    settingSheet.dismiss();
  };

  const theme = useTheme();

  const { user } = useSession();

  if (!user) {
    return (
      <View flex={1} ai="center" jc="center">
        <ActivityIndicator size="large" color={theme.color.get()} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="transits"
        options={{
          title: 'Incoming Transits',
          tabBarActiveTintColor: theme.purple10.get(),
          tabBarIcon: ({ color }) => <Code2 color={color} size={28} />,
          headerRight: () => <SettingsSheet user={user} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarActiveTintColor: theme.blue10.get(),
          tabBarIcon: ({ color }) => <Code2 color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}