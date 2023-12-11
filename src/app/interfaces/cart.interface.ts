import { Address } from "../models/address.model";
import { Item } from "./item.interface";
import { Chef } from "./chef.interface";

export interface Cart {
    chef: Chef,
    items: Item[],
    totalItem?: number,
    totalPrice?: number,
    grandTotal?: number,
    location?: Address,
    deliveryCharge?: number;
    from?: string;
}
