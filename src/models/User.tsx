// Usuário do sistema
export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public pin: string,
    public company_id: number | null = null, // aceita número ou null, padrão null
    public adm_company: boolean = false,
    public create_company: boolean = false,
    public associate: boolean = false,
    public cellphone: string,
    public company_name?: string
  ) {}
}
