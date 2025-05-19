/**
 * Representa um usuário do sistema
 * @field name - nome do usuário
 * @field email - e-mail do usuário
 * @field cellphone - telefone celular
 */
export class User {
    name: string;
    email: string;
    cellphone: string;
  
    constructor(name: string, email: string, cellphone: string) {
      this.name = name;
      this.email = email;
      this.cellphone = cellphone;
    }
  }
  