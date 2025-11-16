import prisma from "../configs/prisma";
import GameCategory from "../schemas/game-category";

class GameCategoryRepository {
    create = async (data: { name: string; slug: string; thumbnail: string; active: number }) => {
        const result = await prisma.gameCategories.create({
            data: new GameCategory(data),
        });
        return result;
    };
}

const gameCategoryRepository = new GameCategoryRepository();
export default gameCategoryRepository;
