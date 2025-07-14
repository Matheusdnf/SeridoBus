// models/PassengerEntry.ts
import { SituationEnum } from './SituationEnum';
export class PassengerEntry {
  constructor(
    public id: number,
    public passengers_list_id: number,
    public name: string,
    public situation: SituationEnum,
    public destination_id: number,
    public created_at?: string
  ) {}
}

