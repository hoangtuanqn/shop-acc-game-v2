import { v7 as uuidv7 } from "uuid";

export interface ServicePackageType {
    id?: string;
    gameServiceId: string;
    name: string;
    price: number;
    active?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class ServicePackage {
    id: string;
    gameServiceId: string;
    name: string;
    price: number;
    active: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(pkg: ServicePackageType) {
        this.id = pkg.id || uuidv7();
        this.gameServiceId = pkg.gameServiceId;
        this.name = pkg.name;
        this.price = pkg.price;
        this.active = pkg.active ?? 1;
        this.createdAt = pkg.createdAt || new Date();
        this.updatedAt = pkg.updatedAt || new Date();
    }
}

export default ServicePackage;
