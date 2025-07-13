import { supabase } from "../database/supabase";
import { Company } from "../models/Company";

export default class CompanyService {
  static async RegisterCompany(Company: Company) {
    const { data, error } = await supabase
      .from("Company")
      .insert({
        name: Company.name,
      })
      .select();
    if (error) throw error;
    return data[0];
  }

  static async EditCompany(Company: Company) {
    const { data, error } = await supabase
      .from("Company")
      .update({
        name: Company.name,
      })
      .eq("id", Company.id)
      .select();
    if (error) throw error;
    return data[0];
  }

  static async DeleteCompany(Company: Company) {
    const { error } = await supabase
      .from("Company")
      .delete()
      .eq("id", Company.id);
    if (error) throw error;
      
  }
  static async SearchCompany(Company: Company, name: string) {
    const { data, error } = await supabase
      .from("Company")
      .select("*")
      .eq("name", name);
    if (error) throw error;
    return data[0];
  }

  static async ListCompanies() {
    const { data, error } = await supabase
      .from("Company")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data as Company[];
  }
  
}
