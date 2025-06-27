  // Lista de passageiros por data e tipo de viagem
  export class PassengersList {
    constructor(
      public id: number,
      public date: string, // formato ISO: YYYY-MM-DD
      public tripType: string,
      public bus_id: number
    ) {}
  }