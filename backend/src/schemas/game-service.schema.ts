import { v7 as uuidv7 } from "uuid";
import Helpers from "~/utils/helpers";

export interface GameServiceType {
    id?: string;
    name: string;
    slug?: string;
    thumbnail?: string;
    description?: string;
    active?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class GameService {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    description: string;
    active: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(service: GameServiceType) {
        this.id = service.id || uuidv7();
        this.name = service.name;
        this.slug = service.slug || Helpers.generateSlug(this.name);
        this.thumbnail = service.thumbnail || "";
        this.description = service.description || "";
        this.active = service.active ?? 1;
        this.createdAt = service.createdAt || new Date();
        this.updatedAt = service.updatedAt || new Date();
    }
}

export default GameService;
