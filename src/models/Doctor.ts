import { Specialization } from './Specialization';
import { Leave } from "./Leave";
import { UserData } from './UserData';
import ReviewModel from './ReviewModel';

export class Doctor extends UserData{

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        role: string,
        public country: string,
        public state: string,
        public city: string,
        public street: string,
        public number: string,
        public zipCode: string,
        public isVerified: boolean,
        public avatar: any,
        public profileDescription: string,
        public specializations: Specialization[],
        password?: string,
        public reviews?: ReviewModel[],
        public leaves?: Leave[]
    ){
            super(id, firstName, lastName, email, password as string, role);
    }
}