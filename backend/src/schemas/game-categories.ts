import { v7 as uuidv7 } from "uuid";

export interface GameCategoriesType {
    id?: string;
    name: string;
    slug?: string;
    thumbnail?: string;
    active?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class GameCategories {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    active: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(category: GameCategoriesType) {
        this.id = category.id || uuidv7();
        this.name = category.name;
        this.slug = category.slug || "";
        this.thumbnail = category.thumbnail || "";
        this.active = category.active ?? 0;
        this.createdAt = category.createdAt || new Date();
        this.updatedAt = category.updatedAt || new Date();
    }
}

export default GameCategories;

