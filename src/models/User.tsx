// Usuário do sistema
export class User {
  constructor(
    public id: number,
    public code: number,
    public name: string,
    public email: string,
    public pin: string,
    public cellphone?: string
  ) {}
}
