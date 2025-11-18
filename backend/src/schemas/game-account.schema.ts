import { v7 as uuidv7 } from "uuid";

export default class GameAccount {
    id: string;
    groupId: string;
    accountName: string;
    password: string;
    price: number;
    status: number;
    buyerId?: string;
    details: {[key: string]: any};
    thumb: string;
    images: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(account: {
        id?: string;
        groupId: string;
        accountName: string;
        password: string;
        price: number;
        status?: number;
        buyerId?: string;
        details?: {[key: string]: any};
        thumb: string;
        images: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.id = account.id || uuidv7();
        this.groupId = account.groupId;
        this.accountName = account.accountName;
        this.password = account.password;
        this.price = account.price;
        this.status = account.status ?? 0;
        this.buyerId = account.buyerId;
        this.details = account.details ?? {};
        this.thumb = account.thumb;
        this.images = account.images;
        this.createdAt = account.createdAt || new Date();
        this.updatedAt = account.updatedAt || new Date();
    }
}
