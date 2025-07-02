// Usuário do sistema
export class User {
  constructor(
    public id: number,
    public code: number,
    public name: string,
    public email: string,
    public pin: string,
    public company_id: number,
    public adm_company: boolean = false,
    public create_company: boolean = false,
    public associate: boolean = false,
    public cellphone: string
  ) {}
}
