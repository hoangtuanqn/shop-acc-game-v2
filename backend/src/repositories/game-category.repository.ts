import prisma from "~/configs/prisma";
import GameCategory from "~/schemas/game-category";

class GameCategoryRepository {
    create = async (data: { name: string; slug: string; thumbnail: string; active: number }) => {
        const result = await prisma.gameCategories.create({
            data: new GameCategory(data),
        });
        return result;
    };

    edit = async (id: string, data: { name: string; slug: string; thumbnail: string; active: number }) => {
        return prisma.gameCategories.update({
            where: { id },
            data,
        });
    };
    
    delete = async (id: string) => {
        return prisma.gameCategories.delete({
            where: { id },
        })
    }
}

const gameCategoryRepository = new GameCategoryRepository();
export default gameCategoryRepository;
