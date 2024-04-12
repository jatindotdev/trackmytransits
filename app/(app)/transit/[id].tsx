import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { View, Text } from 'tamagui';

export default function Transit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [transit, setTransit] = useState<Tables<'transit'> | null>(null);

  useEffect(() => {
    fetchTransit(id);
  }, [id]);

  const fetchTransit = async (id: string) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('transit')
      .select('*')
      .eq('id', id)
      .single();

    setLoading(false);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching transit',
        text2: error.message,
      });
      router.back();
      return;
    }

    console.log(data);

    setTransit(data);
  };

  if (loading || !transit) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Transit {transit.id} Yo</Text>
    </View>
  );
}