import { any } from "zod";
import prisma from "~/configs/prisma";
import { CreateGameAccountRequestBody, EditGameAccountRequestBody } from "~/models/requests/game-account.request";
import GameAccount from "~/schemas/game-account.schema";

class GameAccountRepository {
    create = async (groupId: string, data: CreateGameAccountRequestBody) => {
        const gameAccount = new GameAccount({
            ...data,
            groupId,
        });
        const result = await prisma.gameAccounts.create({
            data: gameAccount,
        });
        return result;
    };

    findByGroupId = async (id: string) => {
        const result = await prisma.gameGroups.findUnique({
            where: { id },
        });
        return result;
    };

    edit = async (id: string, data: EditGameAccountRequestBody) => {
        const result = await prisma.gameAccounts.update({
            where: { id },
            data,
        });
        return result;
    };

    findByAccountId = async (id: string) => {
        const result = await prisma.gameAccounts.findUnique({
            where: { id },
        });
        return result;
    };

    delete = async (id: string) => {
        return prisma.gameAccounts.delete({
            where: { id },
        });
    };
}

const gameAccountRepository = new GameAccountRepository();
export default gameAccountRepository;
