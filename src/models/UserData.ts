export abstract class UserData{

    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public email: string, 
        public role: string,
        public password?: string
    ){
    }
}