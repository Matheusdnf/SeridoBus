import InstitutionService from "../src/services/services_intitution";
import { Institution } from "../src/models/Institution";
import { expect, test } from "@jest/globals";

test("UpdateInstitution: deve atualizar uma instituição existente", async () => {
  try {
    const instituicaoNova = new Institution(0, "Instituição Original");
    const resultadoCadastro = await InstitutionService.RegisterInstitution(
      instituicaoNova
    );

    const instituicaoAtualizada = new Institution(
      resultadoCadastro.id,
      "Instituição Atualizada"
    );

    const resultadoAtualizacao = await InstitutionService.EditInstitutions(
      instituicaoAtualizada
    );

    console.log("Resultado da atualização:", resultadoAtualizacao);

    expect(resultadoAtualizacao).toBeDefined();
    expect(resultadoAtualizacao.id).toBe(resultadoCadastro.id);
    expect(resultadoAtualizacao.name).toBe("Instituição Atualizada");
  } catch (e) {
    console.error("Erro durante o teste:", e);
    throw e;
  }
}, 15000);
