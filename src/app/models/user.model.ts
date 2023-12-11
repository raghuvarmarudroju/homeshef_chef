export class User {
    
    constructor(
        public email: string,
        public phone: string,
        public name?: string,
        public id?: string,
        public type?: string,
        public status?: string,
        public photo?: string,
        // below fields for rider
        public vehicle?: string,
        public latitude?: number,
        public longitude?: number,
        public current_duty?: string,
    ) {}

}