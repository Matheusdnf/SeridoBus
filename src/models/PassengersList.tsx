import { ShiftEnum }    from './ShiftEnum';
import { TripTypeEnum } from './TripTypeEnum';

export class PassengersList {
  constructor(
    public id: number,
    public date: string,
    public trip_type: TripTypeEnum,
    public shift: ShiftEnum,
    public company_id: number,
    public bus_id: number | null,
  ) {}
}
