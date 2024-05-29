export abstract class UserData{

    constructor(
        public id?: number,
        public firstName?: any,
        public lastName?: any,
        public email?: string, 
        public role?: string,
        public password?: string
    ){
    }
}