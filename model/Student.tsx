import { Institution } from "./Institution";
import { Shift } from "./Shift";

/**
 * Representa um estudante
 * @field id - identificador do estudante
 * @field president - indica se é presidente de turma
 * @field institution - instituição a qual pertence
 * @field associate - indica se é associado
 * @field shift - turno em que estuda
 */
export class Student {
  id: number;
  president: boolean;
  institution: Institution;
  associate: boolean;
  shift: Shift;

  constructor(
    id: number,
    president: boolean,
    institution: Institution,
    associate: boolean,
    shift: Shift
  ) {
    this.id = id;
    this.president = president;
    this.institution = institution;
    this.associate = associate;
    this.shift = shift;
  }
}
