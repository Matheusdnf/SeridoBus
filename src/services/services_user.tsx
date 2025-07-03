import { supabase } from "../database/supabase";
import { User } from "../models/User";

export default class UserService {
  static async RegisterUser(User: User) {
    const { data, error } = await supabase
      .from("User")
      .insert({
        name: User.name,
        email:User.email,
        code:User.code,
        pin:User.pin,
        
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

  static async ListCompany() {
    const { data, error } = await supabase
      .from("Company")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data as Company[];
  }
}
