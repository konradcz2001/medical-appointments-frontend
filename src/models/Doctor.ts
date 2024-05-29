import { Specialization } from './Specialization';
import { Leave } from "./Leave";
import { UserData } from './UserData';
import ReviewModel from './ReviewModel';
import { Address } from './Address';

export class Doctor extends UserData{
    address: any;

    constructor(
        id?: number,
        firstName?: any,
        lastName?: any,
        email?: string,
        role?: string,
        address?: Address,
        // public country: string,
        // public state: string,
        // public city: string,
        // public street: string,
        // public number: string,
        // public zipCode: string,
        public isVerified?: boolean,
        public avatar?: any,
        public profileDescription?: any,
        public specializations?: Specialization[],
        password?: string,
        public reviews?: ReviewModel[],
        public leaves?: Leave[]
    ){
            super(id, firstName, lastName, email, password as string, role);
    }
}