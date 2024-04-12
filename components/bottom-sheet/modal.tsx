import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import type React from 'react';
import { useRef, useMemo, useCallback, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Text, View, useTheme } from 'tamagui';

interface BottomSheetModalProps {
  snapPoints: (string | number)[];
  onDismiss: () => void | Promise<void>;
  onPresent: (...args: (string | number | object)[]) => void | Promise<void>;
}

export const useBottomSheetModal = ({
  snapPoints: initialSnapPoints,
  onDismiss,
  onPresent,
}: BottomSheetModalProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => initialSnapPoints, [initialSnapPoints]);

  const handlePresentModalPress = (...args: (string | number | object)[]) => {
    onPresent(...args);
    bottomSheetModalRef.current?.present();
  };

  return {
    sheetRef: bottomSheetModalRef,
    present: handlePresentModalPress,
    snapPoints,
    onDismiss,
    dismiss: () => bottomSheetModalRef.current?.dismiss(),
  };
};

interface BottomSheetProps {
  children: ReactNode | ReactNode[];
  sheetRef: React.RefObject<BottomSheetModal>;
  snapPoints: (string | number)[];
  onDismiss: () => void | Promise<void>;
}

export const BottomSheet = ({
  children,
  sheetRef,
  snapPoints,
  onDismiss,
}: BottomSheetProps) => {
  const theme = useTheme();
  const colorScheme = useColorScheme() ?? 'dark';

  return (
    <BottomSheetModal
      onDismiss={onDismiss}
      ref={sheetRef}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: {
          light: theme.backgroundStrong.get(),
          dark: theme.background.get(),
        }[colorScheme],
        shadowColor: {
          light: theme.color10.get(),
          dark: theme.color1.get(),
        }[colorScheme],
        shadowOpacity: {
          light: 0.1,
          dark: 0.2,
        }[colorScheme],
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.color.get(),
      }}
      keyboardBehavior="interactive"
    >
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

interface BottomSheetTitleProps {
  children: ReactNode | ReactNode[];
  centerTitle?: boolean;
}

export const BottomSheetTitle = ({
  children,
  centerTitle,
}: BottomSheetTitleProps) => {
  const theme = useTheme();

  return (
    <View px="$4" py="$3" borderBottomWidth="$1" borderBottomColor="$gray2">
      <Text
        textAlign={centerTitle ? 'center' : undefined}
        fontWeight="700"
        fontSize={26}
        color={theme.color.get()}
      >
        {children}
      </Text>
    </View>
  );
};