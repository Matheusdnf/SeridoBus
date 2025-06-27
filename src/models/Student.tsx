import { ShiftEnum } from "./Shift";

  export class Student {
    constructor(
      public id: number,
      public user_id: number,
      public institution_id: number,
      public shift: ShiftEnum,
      public president: boolean = false,
      public associate: boolean = false
    ) {}
  }