import { Coupon } from "../interfaces/coupon.interface";
import { Item } from "../interfaces/item.interface";
import { Chef } from "../interfaces/chef.interface";
import { Address } from "./address.model";
import { User } from "./user.model";

export class Order {
    constructor(
        public address: Address,
        public chef_id: string,
        public user: any,
        public order: Item[],
        public total: number,
        public grandTotal: number,
        public deliveryCharge: number,
        public status: string,
        public payment_status: boolean,
        public payment_mode: string,
        public discount: number,
        public id?: string,
        public user_id?: string,
        public instruction?: string,
        public created_at?: any,
        public updated_at?: any,
        public chef?: Chef,
        public coupon?: Coupon,
        public payment_id?: string,
        // public duration?: string,
        public rating?: {
            rate_chef?: number,
            comment_chef?: string,
            rate_rider?: number,
            comment_rider?: string
        },
        public rider?: User,
        public rider_id?: string
    ) {}
}