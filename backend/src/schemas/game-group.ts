import { v7 as uuidv7 } from "uuid";
import Helpers from "~/utils/helpers";

export interface GameGroupType {
    id?: string;
    categoryId: string;
    title: string;
    slug?: string;
    thumbnail?: string;
    active?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class GameGroup {
    id: string;
    categoryId: string;
    title: string;
    slug: string;
    thumbnail: string;
    active: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(group: GameGroupType) {
        this.id = group.id || uuidv7();
        this.categoryId = group.categoryId;
        this.title = group.title;
        this.slug = group.slug || Helpers.generateSlug(this.title);
        this.thumbnail = group.thumbnail || "";
        this.active = group.active ?? 1;
        this.createdAt = group.createdAt || new Date();
        this.updatedAt = group.updatedAt || new Date();
    }
}

export default GameGroup;
