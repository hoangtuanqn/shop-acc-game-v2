import prisma from "~/configs/prisma";
import { CreateGameAccountRequestBody, EditGameAccountRequestBody } from "~/models/requests/game-account.request";
import GameAccount from "~/schemas/game-account.schema";
import { paginate } from "~/utils/pagination";

class GameAccountRepository {
    create = async (groupId: string, data: CreateGameAccountRequestBody) => {
        const gameAccount = new GameAccount({
            ...data,
            groupId,
            images: JSON.stringify(data.images),
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

    getAllByGroupId = async (params: { groupId: string; page?: number; limit?: number }) => {
        const { groupId, page, limit } = params;

        const result = await paginate<any>(prisma.gameAccounts, {
            page,
            limit,
            where: { groupId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                price: true,
                details: true,
                status: true,
                thumb: true,
                images: true,
                createdAt: true,
                updatedAt: true,
                // KHÔNG select: accountName, password, buyerId
            },
        });

        return result;
    };

    getAccountDetail = async (accountId: string) => {
        return prisma.gameAccounts.findUnique({
            where: { id: accountId },
            select: {
                id: true,
                name: true,
                price: true,
                status: true,
                thumb: true,
                images: true,
                details: true,
                createdAt: true,
                updatedAt: true,
                // KHÔNG select: accountName, password, buyerId
            },
        });
    };

    purchase = async (accountId: string, buyerId: string) => {
        return prisma.gameAccounts.update({
            where: { id: accountId },
            data: {
                buyerId,
                status: 1, // 1 = đã bán
            },
        });
    };

    getMyPurchasedAccounts = async (userId: string) => {
        const result = await prisma.gameAccounts.findMany({
            where: { buyerId: userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                accountName: true,
                password: true,
                price: true,
                status: true,
                thumb: true,
                images: true,
                details: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return result;
    };
}

const gameAccountRepository = new GameAccountRepository();
export default gameAccountRepository;
