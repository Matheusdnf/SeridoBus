// Por exemplo, em: src/lib/supabase.ts

import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env"; // Agora o TypeScript reconhece este import!

// Verificação para garantir que as variáveis não estão vazias
if (!SUPABASE_URL) {
  throw new Error(
    "A variável REACT_NATIVE_SUPABASE_URL não foi encontrada no .env"
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    "A variável REACT_NATIVE_SUPABASE_ANON_KEY não foi encontrada no .env"
  );
}

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

// A interface do createClient já é tipada, então você ganha autocomplete aqui
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
