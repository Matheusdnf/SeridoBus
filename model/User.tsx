/**
 * Representa um usuário do sistema
 * @field id - identificador único
 * @field code - código do usuário
 * @field name - nome do usuário
 * @field email - e-mail do usuário
 * @field cellphone - telefone celular
 * @field registredRide - status da carona registrada
 * @field pin - código PIN de acesso
 */
export class User {
    id: number;
    code: number;
    name: string;
    email: string;
    cellphone: string;
    registredRide: string;
    pin: string;
  
    constructor(
      id: number,
      code: number,
      name: string,
      email: string,
      cellphone: string,
      registredRide: string,
      pin: string
    ) {
      this.id = id;
      this.code = code;
      this.name = name;
      this.email = email;
      this.cellphone = cellphone;
      this.registredRide = registredRide;
      this.pin = pin;
    }
  }
  