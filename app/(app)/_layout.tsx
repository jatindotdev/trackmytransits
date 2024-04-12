import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import config from '@/tamagui.config';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { TamaguiProvider, Theme, View, useTheme } from 'tamagui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useSession } from '@/lib/ctx';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { isLoading, user } = useSession();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <RootLayoutNav role={user.role} />;
}

function RootLayoutNav({
  role,
}: {
  role: string;
}) {
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View w="100%" h="100%">
          <Stack>
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(receptionist)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(worker)" options={{ headerShown: false }} />
            <Stack.Screen
              name="settings"
              options={{
                headerShown: true,
                headerTitle: 'Settings',
                headerBackTitle: 'Home',
              }}
            />
          </Stack>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
