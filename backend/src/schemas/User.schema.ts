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
    banned?: boolean;
    ipAddress?: string | null;
    rememberToken?: string | null;
    emailVerifiedAt?: Date | null;
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
    banned: boolean;
    ipAddress: string | null;
    rememberToken: string | null;
    emailVerifiedAt: Date | null;
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
        this.banned = user.banned || false;
        this.ipAddress = user.ipAddress || null;
        this.rememberToken = user.rememberToken || null;
        this.emailVerifiedAt = user.emailVerifiedAt || null;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
}

export default User;
