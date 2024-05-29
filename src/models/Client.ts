import ReviewModel from "./ReviewModel";
import { UserData } from "./UserData";

export class Client extends UserData{

    constructor(
        id?: number,
        firstName?: string,
        lastName?: string,
        email?: string,
        role?: string,
        password?: string,
        public reviews?: ReviewModel[]
    ){
            super(id, firstName, lastName, email, password as string, role);
    }
}