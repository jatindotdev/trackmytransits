import React from 'react';
import { Tabs } from 'expo-router';
import { ActivityIndicator, Pressable } from 'react-native';

import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';
import { Code2, Settings } from '@tamagui/lucide-icons';
import { View, useTheme } from 'tamagui';
import { useSession } from '@/lib/ctx';
import { SettingsSheet } from '@/components/bottom-sheet/settings';

export default function TabLayout() {
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
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarActiveTintColor: theme.purple10.get(),
          tabBarIcon: ({ color }) => <Code2 color={color} size={28} />,
          headerRight: () => <SettingsSheet user={user} />,
        }}
      />
    </Tabs>
  );
}