import { supabase } from "../database/supabase";
import { User } from "../models/User";

export default class UserService {
  // lista de usuário
  static async listUsers(): Promise<User[]> {
    const { data, error } = await supabase.from("user_profile").select(`
        id,
        name,
        company_id,
        adm_company,
        create_company,
        associate,
        cellphone,
        company:Company(name),
        auth:auth.users(email)
      `);
    if (error) throw error.message;
    return data.map(
      (item: any) =>
        new User(
          item.id,
          item.name,
          item.auth?.email ?? "", // email do auth.users
          "",
          item.company_id,
          item.adm_company,
          item.create_company,
          item.associate,
          item.cellphone,
          item.company?.name ?? "" // nome da company via join
        )
    );
  }

  //Buscar usuário
  static async searchUsersByName(name: string): Promise<User[]> {
    const { data, error } = await supabase
      .from("user_profile")
      .select(
        `
        id,
        name,
        company_id,
        adm_company,
        create_company,
        associate,
        cellphone,
        company:Company(name),
        auth:auth.users(email)
      `
      )
      .ilike("name", `%${name}%`);

    if (error) throw error.message;

    return data.map(
      (item: any) =>
        new User(
          item.id,
          item.name,
          item.auth?.email ?? "",
          "",
          item.company_id,
          item.adm_company,
          item.create_company,
          item.associate,
          item.cellphone,
          item.company?.name ?? ""
        )
    );
  }
  // excluir usuário pelo email
  static async deleteUser(email: string) {
    const { error } = await supabase.auth.admin.deleteUser(email);
    if (error) throw error.message;
  }
}
