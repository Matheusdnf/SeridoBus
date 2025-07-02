import DestinationService from "../src/services/services_Destination";
import { Destination } from "../src/models/Destination";
import { expect, test } from "@jest/globals";

test("UpdateDestination: deve atualizar uma instituição existente", async () => {
  try {
    const instituicaoNova = new Destination(0, "Instituição Original");
    const resultadoCadastro = await DestinationService.RegisterDestination(
      instituicaoNova
    );

    const instituicaoAtualizada = new Destination(
      resultadoCadastro.id,
      "Instituição Atualizada"
    );

    const resultadoAtualizacao = await DestinationService.EditDestinations(
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
