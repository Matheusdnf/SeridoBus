import { supabase } from "../src/database/supabase";
import { expect, test } from "@jest/globals";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";
// Teste de diagnóstico
test("debug: deve se conectar e capturar o erro exato da consulta", async () => {
  console.log(
    "URL do Supabase no Teste:",
    SUPABASE_URL ? "Carregada" : "NÃO CARREGADA"
  );
  console.log(
    "Chave Anon do Supabase no Teste:",
    SUPABASE_ANON_KEY ? "Carregada" : "NÃO CARREGADA"
  );
  try {
    const { data, error } = await supabase
      .from("institution") // Nome da Tabela
      .select("*")
      .limit(1);
    console.log(data, error);
    console.log("Requizição:", JSON.stringify(data, null, 2));
    console.log("Erro:", JSON.stringify(error, null, 2));

    // A asserção principal
    expect(error).toBeNull();
  } catch (e) {
    // Se um erro inesperado for lançado
    console.error("Erro", e);
    // Força o teste a falhar se uma exceção for lançada
    throw e;
  }
}, 15000);
