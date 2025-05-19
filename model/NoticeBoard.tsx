import { User } from "./User";

/**
 * Representa um aviso no mural
 * @field id - identificador do aviso
 * @field notice - texto do aviso
 * @field user - usuário que publicou o aviso
 */
export class NoticeBoard {
  id: number;
  notice: string;
  user: User;

  constructor(id: number, notice: string, user: User) {
    this.id = id;
    this.notice = notice;
    this.user = user;
  }
}
