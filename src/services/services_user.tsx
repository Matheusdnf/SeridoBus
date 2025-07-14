import { supabase } from "../database/supabase";
import { User } from "../models/User";

export default class UserService {
  // pega a lista de usuário
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
          "", // senha/pin nunca vem do back-end
          item.company_id,
          item.adm_company,
          item.create_company,
          item.associate,
          item.cellphone,
          item.company?.name ?? "" // nome da empresa via join
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

  static async listUsersByCompanyId(companyId: string): Promise<User[]> {
    const { data, error } = await supabase
      .from("user_profile")
      .select(`
        id,
        name,
        company_id,
        adm_company,
        create_company,
        associate,
        cellphone,
        company:Company(name),
        auth:auth.users(email)
      `)
      .eq("company_id", companyId);

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
  // UserService.ts
static async current(): Promise<User | null> {
  // pega usuário logado
  const { data: { session }, error: sErr } = await supabase.auth.getSession();
  if (sErr || !session?.user) return null;

  const { data, error } = await supabase
    .from("user_profile")
    .select(`
      id, name, company_id, adm_company, create_company,
      associate, cellphone, company:Company(name)
    `)
    .eq("id", session.user.id)   // filtro pelo id do auth
    .single();

  if (error) throw error.message;

  return new User(
    data.id,
    data.name,
    session.user.email ?? "",
    "",
    data.company_id,
    data.adm_company,
    data.create_company,
    data.associate,
    data.cellphone,
    data.company?.[0]?.name ?? ""
  );
}

}
