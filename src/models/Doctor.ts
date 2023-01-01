import { Specialization } from './Specialization';
import { Leave } from "./Leave";
import { UserData } from './UserData';

export class Doctor extends UserData{

    constructor(
        public id: number,
        firstName: string,
        lastName: string,
        email: string,
        phoneNumber: string,
        country: string,
        state: string,
        city: string,
        street: string,
        number: string,
        zipCode: string,
        public isVerified: boolean,
        public avatar: any,
        public profileDescription: string,
        public specializations: Specialization[],
        public leaves: Leave[]){
            super(firstName, lastName, email, phoneNumber, country, state, city, street, number, zipCode);
    }
}