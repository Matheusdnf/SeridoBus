export class UserAsPassenger {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public cellphone: string,
        public adm_company: boolean = false,
        public associate: boolean = false
    ) {}
}