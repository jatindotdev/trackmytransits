import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';
import { Code2, Settings } from '@tamagui/lucide-icons';

export default function TabLayout() {
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
        name="index"
        options={{
          title: 'Incoming Transits',
          tabBarIcon: ({ color }) => <Code2 color={color} size={28} />,
          headerRight: () => {
            return (
              <Link href="/settings" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <Settings
                      opacity={pressed ? 0.5 : 1}
                      size={24}
                      style={{
                        marginRight: 16,
                      }}
                    />
                  )}
                </Pressable>
              </Link>
            );
          },
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Add to inventory',
          tabBarIcon: ({ color }) => <Code2 color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
