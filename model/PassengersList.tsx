import { Student } from "./Student";
import { Hitchhiker } from "./Hitchhiker";

/**
 * Representa uma lista de passageiros
 * @field date - data da viagem
 * @field tripType - tipo de viagem (ida, volta, etc.)
 * @field students - lista de estudantes
 * @field hitchhiker - lista de caroneiros
 */
export class PassengersList {
  date: Date;
  tripType: string;
  students: Student[];
  hitchhiker: Hitchhiker[];

  constructor(date: Date, tripType: string) {
    this.date = date;
    this.tripType = tripType;
    this.students = [];
    this.hitchhiker = [];
  }

  /**
   * Adiciona um estudante à lista
   */
  addStudent(student: Student) {
    this.students.push(student);
  }

  /**
   * Remove um estudante da lista
   */
  removeStudent(student: Student) {
    this.students = this.students.filter(s => s.id !== student.id);
  }
}
