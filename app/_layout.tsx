import { SessionProvider } from '@/lib/ctx';
import config from '@/tamagui.config';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Slot } from 'expo-router';
import { useColorScheme } from 'react-native';
import { TamaguiProvider, Theme, useTheme } from 'tamagui';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';

export default function Root() {
  const colorScheme = useColorScheme();
  return (
    <SessionProvider>
      <TamaguiProvider config={config} defaultTheme={colorScheme as string}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Theme name={colorScheme}>
            <Slot />
            <ToastProvider />
          </Theme>
        </ThemeProvider>
      </TamaguiProvider>
    </SessionProvider>
  );
}

export function ToastProvider() {
  const theme = useTheme();

  return (
    <Toast
      topOffset={80}
      bottomOffset={100}
      config={{
        success: props => (
          <BaseToast
            {...props}
            text1Style={{ color: theme.color.val }}
            text2Style={{ color: theme.color10.val }}
            style={{
              borderLeftColor: 'green',
              backgroundColor: theme.background.val,
            }}
          />
        ),
        error: props => (
          <ErrorToast
            {...props}
            text1Style={{ color: theme.color.val }}
            text2Style={{ color: theme.color10.val }}
            style={{
              borderLeftColor: 'red',
              backgroundColor: theme.background.val,
            }}
          />
        ),
        info: props => (
          <InfoToast
            {...props}
            text1Style={{ color: theme.color.get() }}
            text2Style={{ color: theme.color10.get() }}
            style={{
              borderLeftColor: 'yellow',
              backgroundColor: theme.background.get(),
            }}
          />
        ),
      }}
    />
  );
}