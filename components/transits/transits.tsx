import { View, Text, useTheme } from 'tamagui';
import NewTransit from '@/components/transits/new-transit';
import { useState } from 'react';
import { TransitCard } from '@/components/transits/transit-card';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';
import { TransitPage } from '@/components/transits/transit';
import useSWR from 'swr';
import { fetchIncomingTransits, fetchInventory } from '@/lib/fetchers';
import {
  BottomSheet,
  useBottomSheetModal,
} from '@/components/bottom-sheet/modal';

export function Transits() {
  const {
    data: pendingTransits,
    isLoading: loading,
    error,
    mutate,
  } = useSWR('transits', fetchIncomingTransits);

  const {
    data: completedTransits,
    isLoading: loadingCompleted,
    error: errorCompleted,
    mutate: mutateCompleted,
  } = useSWR('inventory', fetchInventory);

  const [selectedTransit, setSelectedTransit] = useState<{
    index: number;
    type: 'pending' | 'completed';
  }>({
    index: 0,
    type: 'pending',
  });

  const sheetProps = useBottomSheetModal({
    snapPoints: ['92.5%'],
    onDismiss: () => console.log('onDismiss'),
    onPresent: (index, type) =>
      setSelectedTransit({
        index,
        type,
      } as { index: number; type: 'pending' | 'completed' }),
  });

  const theme = useTheme();

  if (error || errorCompleted) {
    return (
      <View flex={1} ai="center" jc="center">
        <Text>Error fetching transits.</Text>
      </View>
    );
  }

  if (loading || !pendingTransits || loadingCompleted || !completedTransits) {
    return (
      <View flex={1} ai="center" jc="center">
        <ActivityIndicator size="large" color={theme.color.get()} />
      </View>
    );
  }

  const transit = {
    pending: pendingTransits,
    completed: completedTransits,
  }[selectedTransit.type][selectedTransit.index];

  return (
    <View flex={1} ai="center" gap="$3.5" bg="$backgroundStrong">
      <SectionList
        sections={[
          {
            data: pendingTransits,
            key: 'pending',
            keyExtractor: item => item.id.toString(),
            renderItem: ({ item, index }) => (
              <TransitCard
                transit={item}
                presentModal={() => sheetProps.present(index, 'pending')}
              />
            ),
          },
          {
            data: completedTransits,
            key: 'completed',
            keyExtractor: item => item.id.toString(),
            renderItem: ({ item, index }) => (
              <TransitCard
                transit={item}
                presentModal={() => sheetProps.present(index, 'completed')}
              />
            ),
          },
        ]}
        ItemSeparatorComponent={() => <View h="$1" />}
        ListEmptyComponent={
          <View flex={1} ai="center" jc="center">
            <Text>No Transit items.</Text>
          </View>
        }
        renderSectionHeader={sections => {
          if (sections.section.key === 'pending') {
            return (
              <Text pb="$3" pt="$4" px="$2" fontSize="$6" fontWeight="700">
                Pending Transits
              </Text>
            );
          }

          if (sections.section.key === 'completed') {
            return (
              <Text pb="$3" pt="$4" px="$2" fontSize="$6" fontWeight="700">
                Completed Transits
              </Text>
            );
          }

          return null;
        }}
        style={{ width: '100%' }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              mutate();
              mutateCompleted();
            }}
          />
        }
      />
      {transit && (
        <BottomSheet
          onDismiss={sheetProps.onDismiss}
          sheetRef={sheetProps.sheetRef}
          snapPoints={sheetProps.snapPoints}
        >
          <TransitPage transit={transit} />
        </BottomSheet>
      )}
      <NewTransit bg="$purple10" color="white" pos="absolute" b="$4" r="$4" />
    </View>
  );
}
