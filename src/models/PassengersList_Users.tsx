// Relação entre estudantes e listas de passageiros
export class PassengersList_Users {
  constructor(
    public passengersList_id: number,
    public user_id: number,
    public id: number // id composto passengersList_id, user_id
  ) {}
}
