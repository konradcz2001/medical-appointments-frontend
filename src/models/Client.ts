import ReviewModel from "./ReviewModel";
import { UserData } from "./UserData";

export class Client extends UserData{

    constructor(
        firstName: string,
        lastName: string,
        id?: number,
        email?: string,
        role?: string,
        password?: string,
        public reviews?: ReviewModel[]
    ){
            super(id, firstName, lastName, email, password, role);
    }
}