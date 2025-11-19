import { v7 as uuidv7 } from "uuid";

export interface OrdersServiceType {
    id?: string;
    gameServiceId: string;
    servicePackageId: string;
    buyerId: string;
    accountName: string;
    password: string;
    price: number;
    status?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class OrdersService {
    id: string;
    gameServiceId: string;
    servicePackageId: string;
    buyerId: string;
    accountName: string;
    password: string;
    price: number;
    status: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(order: OrdersServiceType) {
        this.id = order.id || uuidv7();
        this.gameServiceId = order.gameServiceId;
        this.servicePackageId = order.servicePackageId;
        this.buyerId = order.buyerId;
        this.accountName = order.accountName;
        this.password = order.password;
        this.price = order.price;
        this.status = order.status ?? 0;
        this.createdAt = order.createdAt || new Date();
        this.updatedAt = order.updatedAt || new Date();
    }
}

export default OrdersService;
