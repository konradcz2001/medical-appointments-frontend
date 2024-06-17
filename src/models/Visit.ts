

export class Visit{

    constructor(
        public id: number,
        public date: string,
        public type: string,
        public price: number,
        public currency: string,
        public duration: number,
        public isCancelled: boolean,
        public doctorId: number,
        public clientId: number,
        public clientFirstName?: string,
        public clientLastName?: string,
        public doctorFirstName?: string,
        public doctorLastName?: string,
        public notes?: string){
            
        }
}