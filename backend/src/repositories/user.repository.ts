import prisma from "~/configs/prisma";
import User from "~/schemas/user.schema";

class UserRepository {
    create = async (data: { username: string; email: string; password: string }) => {
        const result = await prisma.user.create({
            data: new User(data),
        });
        return result;
    };

    findByEmail = async (email: string) => {
        const result = await prisma.user.findUnique({
            where: { email },
        });
        return result;
    };

    findByUsername = async (username: string) => {
        const result = await prisma.user.findUnique({
            where: { username },
        });
        return result;
    };
    findById = async (id: string) => {
        const result = await prisma.user.findUnique({
            where: { id },
        });
        return result;
    };

    forgotPassword = async (email: string, token: string) => {
        const result = await prisma.user.update({
            where: { email },
            data: { forgotEmailToken: token },
        });
        return result;
    };

    findTokenResetPassword = async (token: string) => {
        const result = await prisma.user.findUnique({
            where: { forgotEmailToken: token },
        });
        return result;
    };

    resetPasswordByToken = async (token: string, password: string) => {
        const result = await prisma.user.update({
            where: { forgotEmailToken: token },
            data: { password, forgotEmailToken: null },
        });
        return result;
    };

    changePassword = async (userId: string, newPassword: string) => {
        const result = await prisma.user.update({
            where: { id: userId },
            data: { password: newPassword },
        });
        return result;
    };

    updateBalance = async (userId: string, newBalance: number) => {
        return prisma.user.update({
            where: { id: userId },
            data: { balance: newBalance },
        });
    };

    updateTokenVerify = async (userId: string, token: string) => {
        return prisma.user.update({
            where: { id: userId },
            data: { emailVerifyToken: token },
        });
    };

    verifyEmail = async (userId: string, token: string) => {
        return prisma.user.update({
            where: { id: userId, verify: 0, emailVerifyToken: token },
            data: { emailVerifyToken: null, verify: 1 },
        });
    };
}
const userRespository = new UserRepository();
export default userRespository;
