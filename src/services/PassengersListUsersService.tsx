import { supabase } from '../database/supabase';
import { PassengersListUsers } from '../models/PassengersListUsers';

export default class PassengersListUsersService {
  /** vincula usuário à lista (ignora erro de duplicidade) */
  static async add(userId: number, listId: number) {
    const { data, error } = await supabase
      .from('passengerslist_users')
      .insert({ passengersList_id: listId, user_id: userId })
      .select()
      .single();

    if (error && error.code !== '23505') throw error; // 23505 = duplicate
    return data as PassengersListUsers;
  }

  /** remove vínculo */
  static async remove(userId: number, listId: number) {
    const { error } = await supabase
      .from('passengerslist_users')
      .delete()
      .eq('passengersList_id', listId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  /** lista usuários de uma lista (só ids) */
  static async listUsers(listId: number) {
    const { data, error } = await supabase
      .from('passengerslist_users')
      .select('user_id')
      .eq('passengersList_id', listId);
    if (error) throw error;
    return data as PassengersListUsers[];
  }
}
