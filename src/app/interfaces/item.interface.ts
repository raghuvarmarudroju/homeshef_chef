export interface Item {
    id: string;
    chef_id: string;
    category_id: any;
    cover: string;
    name: string;
    desc: string;
    price: number;
    veg: boolean;
    status: boolean;
    variation: boolean;
    rating: number;
    quantity?: number;
}