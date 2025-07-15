// services/PassengerEntryService.ts
import { supabase } from '../database/supabase';
import { PassengerEntry } from '../models/PassengerEntry';

export default class PassengerEntryService {
  /** Insere passageiro na lista */
  static async add(entry: Omit<PassengerEntry, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('passengerentry')
      .upsert(entry, {
        onConflict: 'passengers_list_id,name',
        ignoreDuplicates: true,
      })
      .select();

    if (error) throw error;
    return data && data.length ? data[0] : null; 
  }

  /** Lista passageiros por passengers_list_id */
  static async list(listId: number) {
    const { data, error } = await supabase
      .from('passengerentry')
      .select('*')
      .eq('passengers_list_id', listId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as PassengerEntry[];
  }

  /** Atualiza situação ou nome do passageiro (se precisar) */
  static async update(id: number, fields: Partial<Omit<PassengerEntry, 'id' | 'passengers_list_id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('passengerentry')
      .update(fields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as PassengerEntry;
  }

  /** Remove passageiro da lista */
  static async remove(id: number) {
    const { error } = await supabase
      .from('passengerentry')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
