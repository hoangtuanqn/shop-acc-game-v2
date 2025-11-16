import prisma from "~/configs/prisma";
import GameCategories from "~/schemas/game-categories";

class GameCategoriesRepository {
    create = async (data: { name: string; slug?: string; thumbnail?: string; active?: number }) => {
        const result = await prisma.gameCategories.create({
            data: new GameCategories(data),
        });
        return result;
    };
}

const gameCategoriesRepository = new GameCategoriesRepository();
export default gameCategoriesRepository;
