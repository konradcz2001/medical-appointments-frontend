import { Client } from './Client';
import { Doctor } from './Doctor';

export class Visit{
    public notes?: string;

    constructor(
        public id: number,
        public dateOfVisit: string,
        public type: string,
        public doctor: Doctor,
        public client: Client){
            
        }
}