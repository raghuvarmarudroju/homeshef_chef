export interface Chef {

    id: string;
    cover: string;
    name: string;
    cuisines: string[];
    rating: number;
    delivery_time: number;
    price: number;
    phone?: number;
    email?: string;
    isClose?: boolean;
    description?: string;
    openTime?: string;
    closeTime?: string;
    address?: string;
    distance?: number;
    status?: string;
    totalRating?: number;
    latitude?: number;
    longitude?: number;
    // user_id?: string;
    // city_id?: string;
    // location?: any; 
    // created_at?: Date;
    // updated_at?: Date;

}