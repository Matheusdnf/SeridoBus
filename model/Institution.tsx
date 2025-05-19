/**
 * Representa uma instituição
 * @field id - identificador da instituição
 * @field name - nome da instituição
 */
export class Institution {
    id: number;
    name: string;
  
    constructor(id: number, name: string) {
      this.id = id;
      this.name = name;
    }
  }
  