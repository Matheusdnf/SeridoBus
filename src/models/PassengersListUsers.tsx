// Relação entre estudantes e listas de passageiros
export class PassengersListUsers {
  constructor(
    public id: number,
    public passengerslist_id: number,
    public user_id: string
  ) {}
}
