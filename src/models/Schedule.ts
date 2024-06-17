
export class Schedule{

    constructor(
        public mondayStart?: string,
        public mondayEnd?: string,
        public tuesdayStart?: string,
        public tuesdayEnd?: string,
        public wednesdayStart?: string,
        public wednesdayEnd?: string,
        public thursdayStart?: string,
        public thursdayEnd?: string,
        public fridayStart?: string,
        public fridayEnd?: string,
        public saturdayStart?: string,
        public saturdayEnd?: string,
        public sundayStart?: string,
        public sundayEnd?: string
    ){
    }
}