  // Usuário do sistema
  export class User {
    constructor(
      public id: number,
      public code: number,
      public name: string,
      public email: string,
      public cellphone?: string,
      public pin?: string
    ) {}
  }