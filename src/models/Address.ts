
export class Address{

    constructor(
        public country?: string,
        public state?: string,
        public city?: string,
        public street?: string,
        public houseNumber?: string,
        public zipCode?: string
    ){
    }
}