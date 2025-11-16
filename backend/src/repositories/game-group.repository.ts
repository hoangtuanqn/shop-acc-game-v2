import prisma from "~/configs/prisma";
import GameGroup from "~/schemas/game-group";

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
}

const gameGroupRepository = new GameGroupRepository();
export default gameGroupRepository;
