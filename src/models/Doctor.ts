import { Specialization } from './Specialization';
import { Leave } from "./Leave";

export class Doctor{
    
    public leaves?: Leave[];
    public profileImg?: any;

    constructor(
        public id: number,
        public name: string,
        public surname: string,
        public specialization: Specialization){

    }
}