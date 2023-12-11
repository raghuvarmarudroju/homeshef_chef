export interface Chat {
    id: string;
    message: string;
    senderType: string;
    senderId: string,
    timestamp: string;
    orderId?: string;
}