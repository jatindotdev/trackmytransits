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

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/(app)/(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const { isLoading, session } = useSession();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  if (!loaded || isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const theme = useTheme();

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View w="100%" h="100%">
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="settings"
              options={{
                headerShown: true,
                headerTitle: 'Settings',
                headerBackTitle: 'Home',
              }}
            />
            <Stack.Screen
              name="(incoming)/incoming"
              options={{
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="(reached)/inventory-checks"
              options={{
                headerShown: true,
              }}
            />
          </Stack>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
