export class TypeOfVisit{

    constructor(
        public id: number,
        public type: string,
        public price: string,
        public currency: string,
        public duration: number,
        public isActive: boolean,
        public doctorId: number
    ){
    }
    
}