import { supabase } from './supabase';

export const fetchIncomingTransits = async () => {
  const { data, error } = await supabase
    .from('transit')
    .select('*, status (*), container (*)')
    .order('updated_at', { ascending: false })
    .filter('reached_destination', 'eq', false);

  if (error) {
    throw error;
  }

  console.log(data);

  return data;
};

export const fetchInventory = async () => {
  const { data, error } = await supabase
    .from('transit')
    .select('*, status (*), container (*)')
    .order('updated_at', { ascending: false })
    .filter('reached_destination', 'eq', true);

  if (error) {
    throw error;
  }

  console.log(data);

  return data;
};

