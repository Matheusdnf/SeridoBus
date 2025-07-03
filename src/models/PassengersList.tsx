// Lista de passageiros por data e tipo de viagem

import { ShiftEnum } from "./ShiftEnum";
import { TripTypeEnum } from "./TripTypeEnum";

export class PassengersList {
  constructor(
    public id: number,
    public date: Date, // formato ISO: YYYY-MM-DD
    public tripType: TripTypeEnum, // "Ida" ou "Volta"
    public shift: ShiftEnum, // "Manha", "Tarde" ou "Noite"
    public company_id: number,
    public bus_id: number
  ) {}
}
