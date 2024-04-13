import { View, Text, useTheme } from 'tamagui';
import NewTransit from '@/components/transits/new-transit';
import { useState } from 'react';
import { TransitCard } from '@/components/transits/transit-card';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';
import { TransitPage } from '@/components/transits/transit';
import useSWR from 'swr';
import { fetchTransits } from '@/lib/fetchers';
import {
  BottomSheet,
  useBottomSheetModal,
} from '@/components/bottom-sheet/modal';

export function Transits() {
  const {
    data: transits,
    isLoading: loading,
    error,
    mutate,
  } = useSWR('transits', fetchTransits);

  const [selectedTransit, setSelectedTransit] = useState<number>(0);

  const sheetProps = useBottomSheetModal({
    snapPoints: ['92.5%'],
    onDismiss: () => console.log('onDismiss'),
    onPresent: id => setSelectedTransit(id as number),
  });

  const theme = useTheme();

  if (error) {
    return (
      <View flex={1} ai="center" jc="center">
        <Text>Error fetching transits.</Text>
      </View>
    );
  }

  if (loading || !transits) {
    return (
      <View flex={1} ai="center" jc="center">
        <ActivityIndicator size="large" color={theme.color.get()} />
      </View>
    );
  }

  const transit = transits.find(t => t.id === selectedTransit);

  return (
    <View flex={1} ai="center" gap="$3.5" bg="$backgroundStrong">
      <SectionList
        sections={[
          {
            data: transits.filter(t => !t.reached_destination),
            key: 'pending',
            keyExtractor: item => item.id.toString(),
            renderItem: ({ item }) => (
              <TransitCard
                transit={item}
                presentModal={() => sheetProps.present(item.id)}
              />
            ),
          },
          {
            data: transits.filter(t => t.reached_destination),
            key: 'completed',
            keyExtractor: item => item.id.toString(),
            renderItem: ({ item }) => (
              <TransitCard
                transit={item}
                presentModal={() => sheetProps.present(item.id)}
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
              <Text py="$3.5" px="$2" fontSize="$6" fontWeight="700">
                Pending Transits
              </Text>
            );
          }

          if (sections.section.key === 'completed') {
            return (
              <Text py="$3.5" pt="$4" px="$2" fontSize="$6" fontWeight="700">
                Completed Transits
              </Text>
            );
          }

          return null;
        }}
        style={{ width: '100%' }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={mutate} />
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