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
}
const userRespository = new UserRepository();
export default userRespository;
