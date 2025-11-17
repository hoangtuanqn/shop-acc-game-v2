import { v7 as uuidv7 } from "uuid";

export default class GameAccount {
  id: string;
  groupId: string;
  accountName: string;
  password: string;
  price: bigint;
  status: number;
  buyerId?: string;
  details: string;
  thumb: string;
  images: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(account: {
    id?: string;
    groupId: string;
    accountName: string;
    password: string;
    price: bigint | number;
    status?: number;
    buyerId?: string;
    details?: string;
    thumb: string;
    images: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = account.id || uuidv7();
    this.groupId = account.groupId;
    this.accountName = account.accountName;
    this.password = account.password;
    this.price = typeof account.price === 'number' ? BigInt(account.price) : account.price;
    this.status = account.status ?? 0;
    this.buyerId = account.buyerId;
    this.details = account.details ?? "";
    this.thumb = account.thumb;
    this.images = account.images;
    this.createdAt = account.createdAt || new Date();
    this.updatedAt = account.updatedAt || new Date();
  }
}