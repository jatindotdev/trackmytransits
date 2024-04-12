import { View, Text, useTheme } from 'tamagui';
import NewTransit from '@/components/transits/new-transit';
import { useCallback, useMemo, useRef, useState } from 'react';
import { TransitCard } from '@/components/transits/transit-card';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { ArrowRight } from '@tamagui/lucide-icons';
import { formatTime } from '@/lib/utils';
import { fetchInventory } from '@/lib/fetchers';
import useSWR from 'swr';

export function Inventory() {
  const {
    data: transits,
    isLoading: loading,
    error,
    mutate,
  } = useSWR('inventory', fetchInventory);

  const [selectedTransit, setSelectedTransit] = useState(0);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['92.5%'], []);

  const handlePresentModalPress = useCallback((index: number) => {
    setSelectedTransit(index);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

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

  const transit = transits[selectedTransit];

  return (
    <View flex={1} ai="center" py="$4" gap="$3.5" bg="$backgroundStrong">
      <FlatList
        style={{ width: '100%' }}
        data={transits}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <TransitCard
            transit={item}
            presentModal={() => handlePresentModalPress(index)}
          />
        )}
        ItemSeparatorComponent={() => <View h="$1" />}
        ListEmptyComponent={
          <View flex={1} ai="center" jc="center">
            <Text>No Inventory items.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={mutate} />
        }
      />
      {transit && (
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{
            backgroundColor: theme.background.get(),
            shadowColor: theme.backgroundStrong.get(),
            shadowOpacity: 0.2,
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.color.get(),
          }}
          keyboardBehavior="interactive"
        >
          <BottomSheetView>
            <View bg="$background" p="$4" w="100%">
              <View jc="space-between" gap="$5" w="100%">
                <Text fontSize="$7" fontWeight="700">
                  {transit.company_name}
                </Text>
                <View gap="$2">
                  <View fd="row" w="100%" justifyContent="space-between">
                    <Text color="$gray9">
                      {transit.reached_destination ? 'Reached' : 'In Transit'}
                    </Text>
                    <Text color="$gray9">#{transit.tracking_id}</Text>
                  </View>
                  <View fd="row" w="100%" justifyContent="space-between">
                    <Text color="$gray9">Billed on</Text>
                    <Text color="$gray9">
                      {formatTime(new Date(transit.billing_date))}
                    </Text>
                  </View>
                  <View
                    mt="$4"
                    pos="relative"
                    fd="row"
                    ai="center"
                    justifyContent="space-between"
                  >
                    <Text
                      textOverflow="ellipsis"
                      w="45%"
                      numberOfLines={1}
                      fontSize={16}
                      color="$gray11"
                    >
                      {transit.origin}
                    </Text>
                    <ArrowRight
                      pos="absolute"
                      left="50%"
                      right="50%"
                      transform={[{ translateX: -10 }]}
                      size={20}
                      color="$gray9"
                    />
                    <Text
                      numberOfLines={1}
                      w="45%"
                      textAlign="right"
                      fontSize={16}
                      color="$gray11"
                    >
                      {transit.destination}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      )}
      <NewTransit bg="$purple10" color="white" pos="absolute" b="$4" r="$4" />
    </View>
  );
}
