import { createHash, createVerify } from "crypto";
import bcrypt from "bcrypt";
export default class AlgoCrypoto {
    static hashPassword = async (pwd: string) => {
        const password = await bcrypt.hashSync(pwd, 10);
        return password;
    };
    static verifyPassword = async (pwd: string, pwdHash: string) => {
        const isValid: boolean = await bcrypt.compare(pwd, pwdHash);
        return isValid;
    };
}
