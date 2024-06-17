export class TypeOfVisit{

    constructor(
        public id: number,
        public type: string,
        public price: number,
        public currency: string,
        public duration: number,
        public doctorId: number
    ){
    }
    
}