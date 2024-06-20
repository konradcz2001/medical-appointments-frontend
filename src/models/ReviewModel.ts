export class ReviewModel {

    constructor(
        public id: number,
        public date: string,
        public rating: number,
        public description: string,
        public doctor_id: number,
        public client_id: number,
        public clientFirstName: string,
        public doctorFirstName: string,
        public doctorLastName: string
        ) {
    }
}

export default ReviewModel;