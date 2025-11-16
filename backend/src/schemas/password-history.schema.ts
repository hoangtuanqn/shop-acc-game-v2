import { v7 as uuidv7 } from "uuid";

interface PasswordHistoryType {
    id?: string;
    userId: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class PasswordHistory {
    id: string;
    userId: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: PasswordHistoryType) {
        this.id = user.id || uuidv7();
        this.userId = user.userId || "";
        this.password = user.password || "";
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default PasswordHistory;
