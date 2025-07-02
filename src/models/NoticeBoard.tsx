// Avisos postados por usuários
export class NoticeBoard {
  constructor(
    public id: number,
    public notice: string,
    public user_id: number
  ) {}
}
