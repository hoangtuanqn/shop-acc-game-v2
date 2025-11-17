import prisma from "~/configs/prisma";
import { EditGameGroupRequestBody } from "~/models/requests/game-group.request";
import GameGroup from "~/schemas/game-group.schema";

class GameGroupRepository {
    create = async (data: { categoryId: string; title: string; slug: string; thumbnail: string; active: number }) => {
        const result = await prisma.gameGroups.create({
            data: new GameGroup(data),
        });
        return result;
    };

    findByCategoryId = async (id: string) => {
        const result = await prisma.gameCategories.findUnique({
            where: { id },
        });
        return result;
    };

    findById = async (id: string) => {
        const result = await prisma.gameGroups.findUnique({
            where: { id },
        });
        return result;
    };

    edit = async (id: string, data: EditGameGroupRequestBody) => {
        const result = await prisma.gameGroups.update({
            where: { id },
            data,
        });
        return result;
    };

    delete = async (id: string) => {
        return prisma.gameGroups.delete({
            where: { id },
        });
    };

    getGameGroups = async (id: string) => {
        const result = await prisma.gameGroups.findMany({
            where: {
                categoryId: id,
                active: 1
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return result;
    };
}

const gameGroupRepository = new GameGroupRepository();
export default gameGroupRepository;
