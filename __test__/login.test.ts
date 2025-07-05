// auth.service.test.ts

import AuthService from "../src/services/services_login"; // ajuste para o caminho correto do seu serviço
import { User } from "../src/models/User"; // ajuste para o caminho correto da sua classe User
import { describe, expect, it, test } from "@jest/globals";
describe("AuthService.SignUpWithEmail", () => {
  it("deve cadastrar um novo usuário e criar o perfil no user_profile", async () => {
    const timestamp = Date.now(); // garante email único a cada teste

    const user = new User(
      0, // id será ignorado, o Supabase gera
      "Fulano de Teste", // name
      `fulano${timestamp}@teste.com`, // email único
      "1234562${timestamp}", // pin (senha)
      1, // company_id
      true, // adm_company
      false, // create_company
      true, // associate
      `999999999`, // cellphone único"
      ""
    );

    try {
      const result = await AuthService.SignUpWithEmail(user);
      expect(result).toHaveProperty("user.id");
      expect(result.user).not.toBeNull();
      expect(result.user?.email).toBe(user.email);
    } catch (error) {
      console.error("❌ Erro no teste de cadastro:", error);
      throw error; // garante que o teste falhe se houver erro
    }
  });
});
