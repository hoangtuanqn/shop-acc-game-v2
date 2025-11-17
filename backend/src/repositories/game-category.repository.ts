import prisma from "~/configs/prisma";
import { EditGameCategoryRequestBody } from "~/models/requests/game-category.request";
import GameCategory from "~/schemas/game-category.schema";

class GameCategoryRepository {
    create = async (data: { name: string; slug: string; thumbnail: string; active: number }) => {
        const result = await prisma.gameCategories.create({
            data: new GameCategory(data),
        });
        return result;
    };

    edit = async (id: string, data: EditGameCategoryRequestBody) => {
        return prisma.gameCategories.update({
            where: { id },
            data,
        });
    };

    delete = async (id: string) => {
        return prisma.gameCategories.delete({
            where: { id },
        });
    };

    findById = async (id: string) => {
        const result = await prisma.gameCategories.findUnique({
            where: { id },
        });
        return result;
    };

    hasGameGroups = async (categoryId: string) => {
        const count = await prisma.gameGroups.count({
            where: { categoryId },
        });
        return count > 0;
    };

    getAll = async () => {
        const result = await prisma.gameCategories.findMany({
            where: {
                active: 1,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return result;
    };
}



const gameCategoryRepository = new GameCategoryRepository();
export default gameCategoryRepository;
