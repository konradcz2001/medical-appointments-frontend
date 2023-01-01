export abstract class UserData{

    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public phoneNumber: string,
        public country: string,
        public state: string,
        public city: string,
        public street: string,
        public number: string,
        public zipCode: string){
    }
}