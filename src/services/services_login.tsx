import { supabase } from "../database/supabase";
import { User } from "../models/User";

export default class AuthService {
  static async SignUpWithEmail(user: User) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.pin,
    });
    if (error) throw error.message;
    return data;
  }
  static async SignInWithEmail(user: User) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.pin,
    });
    if (error) throw error.message;
    return data;
  }
  //   static async GetLogin(user: User) {
  //     const {
  //       data: { User },
  //     } = await supabase.auth.getUser();
  //   }
}
