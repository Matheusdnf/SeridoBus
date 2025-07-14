import { supabase } from "../database/supabase";
import { User } from "../models/User";

export default class AuthService {
  static async SignUpWithEmail(user: User) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.pin,
    });

    if (error) throw error.message;

    const userid = data?.user?.id;

    if (userid) {
      const { error: insertError } = await supabase
        .from("user_profile")
        .insert({
          id: userid,
          name: user.name,
          adm_company: user.adm_company ?? false,
          create_company: user.create_company ?? false,
          associate: user.associate ?? false,
          company_id: user.company_id ?? null,
          cellphone: user.cellphone,
        });

      if (insertError) throw insertError.message;
    }

    return data;
  }

  static async SignInWithEmail({ email, pin }: { email: string; pin: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pin,
    });

    if (error) throw error.message;

    const userId = data?.user?.id;

    let profile = null;

    if (userId) {
      const { data: profileData, error: profileError } = await supabase
        .from("user_profile")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError.message;

      profile = profileData;
    }

    return { auth: data, profile };
  }
  static async SendEmailRedefinitionPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      // configurar no supabase a rota para a tela de atualização de senha
      redirectTo: "https://example.com/update-password",
    });
    if (error) {
      console.error(error.message);
    } else {
      // informar que email foi enviado
      console.log("Email de recuperação enviado!");
    }
  }
  // gerar token para redefinição de senha
  static async setSessionFromToken(token: string) {
    const { error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: "",
    });

    if (error) throw error.message;
  }

  //atualizar para nova senha
  static async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error.message;
    return data;
  }
  // passa rota que ele precisa ir, onde ele se redirecionar
  static async signOut(user: User, navigation: any) {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    navigation.replace(navigation);
  }
}
