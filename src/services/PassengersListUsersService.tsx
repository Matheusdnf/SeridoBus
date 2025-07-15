import { supabase } from '../database/supabase';
import { PassengersListUsers } from '../models/PassengersListUsers';

export default class PassengersListUsersService {
  /** vincula usuário à lista */
  static async add(userId: string, listId: number) {
    const { data, error } = await supabase
      .from('passengerslist_users')
      .upsert(
        { passengerslist_id: listId, user_id: userId },
        { onConflict: 'passengerslist_id,user_id', ignoreDuplicates: true }
      )
      .select();

    if (error) throw error;
    return data?.[0] ?? null;
  }

  /** remove vínculo */
  static async remove(userId: number, listId: number) {
    const { error } = await supabase
      .from('passengerslist_users')
      .delete()
      .eq('passengerslist_id', listId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  /** lista usuários de uma lista (só ids) */
  static async listUsers(listId: number) {
    const { data, error } = await supabase
      .from('passengerslist_users')
      .select('user_id')
      .eq('passengerslist_id', listId);
    if (error) throw error;
    return data as PassengersListUsers[];
  }
}
