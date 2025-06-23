// __tests__/services/supabase.test.ts

import { supabase } from "../src/database/supabase"; // Ajuste o caminho para o seu arquivo de inicialização do Supabase
import { expect, test } from "@jest/globals";

// Teste de diagnóstico
test("debug: deve se conectar e capturar o erro exato da consulta", async () => {
  console.log("Iniciando teste de diagnóstico...");

  // Verifique se as variáveis de ambiente foram carregadas no teste
  console.log(
    "URL do Supabase no Teste:",
    process.env.REACT_NATIVE_SUPABASE_URL ? "Carregada" : "NÃO CARREGADA"
  );
  console.log(
    "Chave Anon do Supabase no Teste:",
    process.env.REACT_NATIVE_SUPABASE_ANON_KEY ? "Carregada" : "NÃO CARREGADA"
  );

  try {
    const { data, error } = await supabase
      .from("profiles") // <-- Mantenha aqui o nome da sua tabela real
      .select("*")
      .limit(1);

    // Vamos imprimir o que quer que tenhamos recebido
    console.log("DADOS RECEBIDOS:", JSON.stringify(data, null, 2));
    console.log("ERRO RECEBIDO:", JSON.stringify(error, null, 2));

    // A asserção principal
    expect(error).toBeNull();
  } catch (e) {
    // Se um erro inesperado for lançado (ex: problema de rede), ele será capturado aqui
    console.error("ERRO INESPERADO CAPTURADO PELO TRY/CATCH:", e);
    // Força o teste a falhar se uma exceção for lançada
    throw e;
  }
}, 15000);
