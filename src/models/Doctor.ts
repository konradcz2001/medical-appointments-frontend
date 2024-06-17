import { Specialization } from './Specialization';
import { Leave } from "./Leave";
import { UserData } from './UserData';
import ReviewModel from './ReviewModel';
import { Address } from './Address';
import { TypeOfVisit } from './TypeOfVisit';
import { Schedule } from './Schedule';

export class Doctor extends UserData{
    address: any;

    constructor(
        firstName: any,
        lastName: any,
        email: string,
        role: string,
        public isVerified: boolean,
        public avatar: any,
        public profileDescription: any,
        address?: Address,
        id?: number,
        public specializations?: Specialization[],
        public schedule?: Schedule,
        password?: string,
        public reviews?: ReviewModel[],
        public leaves?: Leave[],
        public typesOfVisits?: TypeOfVisit[],
    ){
            super(id, firstName, lastName, email, password as string, role);
            this.address = address || new Address();
    }
}