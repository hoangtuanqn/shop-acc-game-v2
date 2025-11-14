import { v7 as uuidv7 } from "uuid";
enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
}

interface UserType {
    id?: string;
    username: string;
    email: string;
    password: string;
    role?: Role;
    balance?: bigint;
    totalDeposited?: bigint;
    items?: bigint;
    verify?: number;
    forgotEmailToken?: string | null;
    emailVerifyToken?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

class User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: Role;
    balance: bigint;
    totalDeposited: bigint;
    items: bigint;
    verify: number;
    forgotEmailToken: string | null;
    emailVerifyToken: string | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: UserType) {
        this.id = user.id || uuidv7();
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role || Role.USER;
        this.balance = user.balance || BigInt(0);
        this.totalDeposited = user.totalDeposited || BigInt(0);
        this.items = user.items || BigInt(0);
        this.verify = user.verify || 0;
        this.forgotEmailToken = user.forgotEmailToken || null;
        this.emailVerifyToken = user.emailVerifyToken || null;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default User;
