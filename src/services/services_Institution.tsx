import { supabase } from "../database/supabase";
import { Institution } from "../models/Institution";

export default class InstitutionService {
  static async RegisterInstitution(Institution: Institution) {
    const { data, error } = await supabase
      .from("Institution")
      .insert({ name: Institution.name })
      .select();
    if (error) throw error;
    return data[0];
  }

  static async EditInstitutions(Institution: Institution) {
    const { data, error } = await supabase
      .from("Institution")
      .update({ name: Institution.name })
      .eq("id", Institution.id)
      .select();
    if (error) throw error;
    return data[0];
  }

  static async DeleteInstitution(Institution: Institution) {
    const { data, error } = await supabase
      .from("Institution")
      .delete()
      .eq("id", Institution.id);
    if (error) throw error;
  }
  static async SearchInstitution(Institution: Institution, name: string) {
    const { data, error } = await supabase
      .from("Institution")
      .select("*")
      .eq("name", name);
    if (error) throw error;
    return data[0];
  }
  static async ListInstitutions() {
    const { data, error } = await supabase
      .from("Institution")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data as Institution[];
  }
}
