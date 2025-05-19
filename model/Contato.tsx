/**
 * Representa um contato da Agenda
 * @field Name - representa um nome
 * @field Phone - representa o telefone
 * @field Email - representa o e-mail
 */

export class Contato{
    name: string;
    phone: string;
    email: string;

    constructor(name: string, phone: string, email: string){
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}