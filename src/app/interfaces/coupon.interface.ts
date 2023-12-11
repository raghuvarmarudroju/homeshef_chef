export interface Coupon {
    id: string;
    code: string;
    discount: number;
    isPercentage: boolean;
    description: string;
    isActive: boolean;
    expiryDate: string;
    minimumOrderAmount?: number;
    upto_discount?: number;
    terms?: string[];
    chef_id?: string;
    saved?: number;
}