/**
 * Representa uma pessoa que pega carona
 * @field id - identificador
 * @field name - nome do caroneiro
 * @field destination - destino da viagem
 */
export class Hitchhiker {
  id: number;
  name: string;
  destination: string;

  constructor(id: number, name: string, destination: string) {
    this.id = id;
    this.name = name;
    this.destination = destination;
  }
}
