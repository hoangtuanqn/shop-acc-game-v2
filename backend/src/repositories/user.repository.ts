import { TokenType, UserVerifyStatus } from "~/constants/enums";
import User from "~/schemas/user.schema";
import prisma from "~/services/database.service";

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
}
const userRespository = new UserRepository();
export default userRespository;
