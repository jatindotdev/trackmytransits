import { supabase } from './supabase';

export const fetchTransits = async () => {
  const { data, error } = await supabase
    .from('transit')
    .select('*, status (*), container (*)')
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  console.log(data);

  return data;
};

export const fetchInventory = async () => {
  const { data, error } = await supabase
    .from('transit')
    .select('*')
    .order('updated_at', { ascending: false })
    .filter('reached_destination', 'eq', true);

  if (error) {
    throw error;
  }

  console.log(data);

  return data;
};

