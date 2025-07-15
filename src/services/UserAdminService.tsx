import { supabase } from "../database/supabase";

const UserAdminService = {
  async list() {
    const { data, error } = await supabase.from("user_profile").select("*");
    if (error) throw error;
    return data;
  },

  async update(
    id: string,
    updates: {
      name: string;
      cellphone?: string | null;
      situation: string;
      adm_company?: boolean;
    }
  ) {
    const { data, error } = await supabase
      .from("user_profile")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
    return data;
  },
};

export default UserAdminService;
