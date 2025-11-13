import { createHash, createVerify } from "crypto";
import bcrypt from "bcrypt";
// export const hashPassword = (content: string): string => {
//     return createHash("sha256").update(content).digest("hex");
// };
// export const verifyPassword = (content: string, contentCompare: string): string => {
//     return createVerify("sha256").update(content).verify("hex");
// };
export const hashPassword = async (pwd: string) => {
    const password = await bcrypt.hashSync(pwd, 10);
    return password;
};
export const verifyPassword = async (pwd: string, pwdHash: string) => {
    const isValid: boolean = await bcrypt.compare(pwd, pwdHash);
    return isValid;
};
