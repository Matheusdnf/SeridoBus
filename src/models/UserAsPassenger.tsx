export class UserAsPassenger {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public cellphone: string,
        public adm_company: boolean = false,
        public associate: boolean = false
    ) {}
}