import { View, Text, useTheme } from 'tamagui';
import { useState } from 'react';
import { TransitCard } from '@/components/transits/transit-card';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';
import { fetchInventory } from '@/lib/fetchers';
import useSWR from 'swr';
import { BottomSheet, useBottomSheetModal } from '../bottom-sheet/modal';
import { InventoryTransit } from './inventory-transit';

export function Inventory() {
  const {
    data: transits,
    isLoading: loading,
    error,
    mutate,
  } = useSWR('inventory', fetchInventory);

  const [selectedTransit, setSelectedTransit] = useState(0);

  const sheetProps = useBottomSheetModal({
    snapPoints: ['92.5%'],
    onDismiss: () => console.log('onDismiss'),
    onPresent: index => setSelectedTransit(index as number),
  });

  const theme = useTheme();

  if (error) {
    return (
      <View flex={1} ai="center" jc="center">
        <Text color="$gray9">Error fetching inventory.</Text>
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
            data: transits.filter(t => !t.received),
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
            data: transits.filter(t => t.received),
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
            <Text>No Inventory items.</Text>
          </View>
        }
        renderSectionHeader={sections => {
          if (sections.section.key === 'pending') {
            return (
              <Text py="$3.5" px="$2" fontSize="$6" fontWeight="700">
                Pending Inventory Items
              </Text>
            );
          }

          if (sections.section.key === 'completed') {
            return (
              <Text py="$3.5" px="$2" fontSize="$6" fontWeight="700">
                Completed Inventory Items
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
        <BottomSheet {...sheetProps}>
          <InventoryTransit transit={transit} />
        </BottomSheet>
      )}
    </View>
  );
}
