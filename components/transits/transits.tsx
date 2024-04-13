import { View, Text, useTheme, Button } from 'tamagui';
import NewTransit from '@/components/transits/new-transit';
import { useState } from 'react';
import { TransitCard } from '@/components/transits/transit-card';
import { ActivityIndicator, RefreshControl, SectionList } from 'react-native';
import { TransitPage, type Transit } from '@/components/transits/transit';
import useSWR from 'swr';
import { fetchTransits } from '@/lib/fetchers';
import {
  BottomSheet,
  useBottomSheetModal,
} from '@/components/bottom-sheet/modal';
import { SearchBar } from '../shared/search-bar';
import Toast from 'react-native-toast-message';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { downloadCSV } from '@/lib/utils';

export function Transits() {
  const {
    data: transits,
    isLoading: loading,
    error,
    mutate,
  } = useSWR('transits', fetchTransits);

  const [selectedTransit, setSelectedTransit] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredTransits = transits.filter(t => {
    if (!searchTerm) return true;

    if (t.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
      return true;
    if (t.contact_number.toLowerCase().includes(searchTerm.toLowerCase()))
      return true;
    if (t.origin.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    if (t.destination.toLowerCase().includes(searchTerm.toLowerCase()))
      return true;
    if (t.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()))
      return true;
    if (t.shipping_company.toLowerCase().includes(searchTerm.toLowerCase()))
      return true;

    return false;
  });

  const transit = filteredTransits.find(t => t.id === selectedTransit);

  const exportTransits = async (transits: Transit[]) => {
    const csv = [
      'Company Name,Contact Number,Origin,Destination,Tracking ID,Shipping Company,Reached Destination',
    ]
      .concat(
        transits.map(t => {
          return `${t.company_name},${t.contact_number},${t.origin},${t.destination},${t.tracking_id},${t.shipping_company},${t.reached_destination}`;
        })
      )
      .join('\n');

    if (!(await isAvailableAsync())) {
      Toast.show({
        type: 'error',
        text1: 'Error sharing transits',
        text2: 'Sharing is not available on this device.',
      });
      return;
    }

    try {
      const csvPath = await downloadCSV(csv, 'transits.csv');

      await shareAsync(csvPath, {
        mimeType: 'text/csv',
        dialogTitle: 'Share transits',
        UTI: 'public.comma-separated-values-text',
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Toast.show({
        type: 'error',
        text1: 'Error sharing transits',
        text2: 'Please try again later.',
      });
    }
  };

  return (
    <View flex={1} ai="center" bg="$backgroundStrong">
      <SearchBar
        placeholder="Search Transits"
        value={searchTerm}
        mt="$2"
        onChange={text => setSearchTerm(text)}
        onClear={() => setSearchTerm('')}
      />
      <SectionList
        sections={[
          {
            data: filteredTransits.filter(t => !t.reached_destination),
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
            data: filteredTransits.filter(t => t.reached_destination),
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
              <View bg="$backgroundStrong" py="$3.5" px="$2">
                <Text fontSize="$6" fontWeight="700">
                  Pending Transits
                </Text>
              </View>
            );
          }

          if (sections.section.key === 'completed') {
            return (
              <View bg="$backgroundStrong" py="$3.5" px="$2">
                <Text fontSize="$6" fontWeight="700">
                  Completed Transits
                </Text>
              </View>
            );
          }

          return null;
        }}
        style={{ width: '100%', paddingBottom: 100 }}
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
      <View
        p="$3"
        fd="row"
        gap="$3"
        bg="$background"
        borderTopColor="$gray2"
        borderTopWidth="$1"
        borderBottomColor="$gray2"
        borderBottomWidth="$1"
        w="100%"
        jc="flex-end"
        ai="center"
      >
        <Button bg="$green9" onPress={() => exportTransits(filteredTransits)}>
          Export Transits
        </Button>
        <NewTransit bg="$purple10" />
      </View>
    </View>
  );
}
