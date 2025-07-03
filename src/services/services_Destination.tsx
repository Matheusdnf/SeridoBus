import { supabase } from "../database/supabase";
import { Destination } from "../models/Destination";

export default class DestinationService {
  static async RegisterDestination(Destination: Destination) {
    const { data, error } = await supabase
      .from("destination")
      .insert({ name: Destination.name })
      .select();
    if (error) throw error;
    return data[0];
  }

  static async EditDestinations(Destination: Destination) {
    const { data, error } = await supabase
      .from("destination")
      .update({ name: Destination.name })
      .eq("id", Destination.id)
      .select();
    if (error) throw error;
    return data[0];
  }

  static async DeleteDestination(Destination: Destination) {
    const { data, error } = await supabase
      .from("destination")
      .delete()
      .eq("id", Destination.id);
    if (error) throw error;
  }
  static async SearchDestination(Destination: Destination, name: string) {
    const { data, error } = await supabase
      .from("destination")
      .select("*")
      .eq("name", name);
    if (error) throw error;
    return data[0];
  }
  static async ListDestinations() {
    const { data, error } = await supabase
      .from("destination")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data as Destination[];
  }
}
