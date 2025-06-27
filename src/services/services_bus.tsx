import { supabase } from "../database/supabase";
import { Bus } from "../models/Bus";

export default class BusService {
  static async RegisterBus(Bus: Bus) {
    const { data, error } = await supabase
      .from("bus")
      .insert({
        name: Bus.name,
        color: Bus.color,
        maxcapacity: Bus.maxCapacity,
      })
      .select();
    if (error) throw error;
    return data[0];
  }

  static async EditBus(Bus: Bus) {
    const { data, error } = await supabase
      .from("bus")
      .update({
        name: Bus.name,
        color: Bus.color,
        maxcapacity: Bus.maxCapacity,
      })
      .eq("id", Bus.id)
      .select();
    if (error) throw error;
    return data[0];
  }

  static async DeleteBus(Bus: Bus) {
    const { data, error } = await supabase
      .from("bus")
      .delete()
      .eq("id", Bus.id);
    if (error) throw error;
  }
  static async SearchBus(Bus: Bus, name: string) {
    const { data, error } = await supabase
      .from("bus")
      .select("*")
      .eq("name", name);
    if (error) throw error;
    return data[0];
  }

  static async ListBus() {
    const { data, error } = await supabase
      .from("bus")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data as Bus[];
  }
}
