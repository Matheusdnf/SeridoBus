import { supabase } from '../database/supabase';
import { PassengersList } from '../models/PassengersList';

export default class PassengersListService {
  /** cria uma lista nova */
  static async create(list: Omit<PassengersList, 'id'>) {
    const { data, error } = await supabase
      .from('passengerslist')
      .insert(list)
      .select()
      .single();
    if (error) throw error;
    return data as PassengersList;
  }

  /** busca uma lista por data + tipo + turno (retorna null se não achar) */
  static async getByDateTripShift(
    dateISO: string,
    tripType: 'Ida' | 'Volta',
    shift: 'Manha' | 'Tarde' | 'Noite'
  ) {
    const { data, error } = await supabase
      .from('passengerslist')
      .select('*')
      .eq('date', dateISO)
      .eq('trip_type', tripType)
      .eq('shift', shift)
      .maybeSingle();

    if (error && error.code === 'PGRST116') return null; // not found
    if (error) throw error;
    return data as PassengersList;
  }

  /** só pra listar tudo de uma vez (opcional) */
  static async listAll() {
    const { data, error } = await supabase
      .from('passengerslist')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data as PassengersList[];
  }

  /** atribui/atualiza ônibus */
  static async setBus(listId: number, busId: number | null) {
    const { data, error } = await supabase
      .from('passengerslist')
      .update({ bus_id: busId })
      .eq('id', listId)
      .select()
      .single();
    if (error) throw error;
    return data as PassengersList;
  }
}
