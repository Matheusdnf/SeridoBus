// Ônibus cadastrado
export class Bus {
  constructor(
    public id: number,
    public name: string,
    public maxCapacity: number,
    public color?: string
  ) {}
}
