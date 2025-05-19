/**
 * Representa um ônibus
 * @field id - identificador do ônibus
 * @field name - nome do ônibus
 * @field color - cor do ônibus
 * @field maxCapacity - capacidade máxima de passageiros
 */
export class Bus {
    id: number;
    name: string;
    color: string;
    maxCapacity: number;
  
    constructor(id: number, name: string, color: string, maxCapacity: number) {
      this.id = id;
      this.name = name;
      this.color = color;
      this.maxCapacity = maxCapacity;
    }
  }
  