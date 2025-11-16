import { v7 as uuidv7 } from "uuid";
import Helpers from "~/utils/helpers";

export interface GameCategoryType {
    id?: string;
    name: string;
    slug?: string;
    thumbnail?: string;
    active?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class GameCategory {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    active: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(category: GameCategoryType) {
        this.id = category.id || uuidv7();
        this.name = category.name;
        this.slug = category.slug || Helpers.generateSlug(this.name);
        this.thumbnail = category.thumbnail || "";
        this.active = category.active ?? 0;
        this.createdAt = category.createdAt || new Date();
        this.updatedAt = category.updatedAt || new Date();
    }
}

export default GameCategory;
