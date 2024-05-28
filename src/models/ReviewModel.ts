class ReviewModel {
    id: number;
    date: string;
    rating: number;
    description: string;
    doctor_id: number;
    client_id: number;

    constructor(id: number, date: string, 
        rating: number, description: string, doctor_id: number, client_id: number) {
            
            this.id = id;
            this.date = date;
            this.rating = rating;
            this.description = description;
            this.doctor_id = doctor_id;
            this.client_id = client_id;
    }
}

export default ReviewModel;