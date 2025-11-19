import prisma from "~/configs/prisma";
import { EditGameServiceRequestBody } from "~/models/requests/game-service.request";

import GameService from "~/schemas/game-service.schema";

class GameServiceRepository {
    create = async (data: { name: string; thumbnail?: string; description?: string; active?: number }) => {
        const result = await prisma.gameServices.create({
            data: new GameService(data),
        });
        return result;
    };

    findById = async (id: string) => {
        return prisma.gameServices.findUnique({
            where: { id },
        });
    };

    edit = async (id: string, data: EditGameServiceRequestBody) => {
        return prisma.gameServices.update({
            where: { id },
            data,
        });
    };

    delete = async (id: string) => {
        return prisma.gameServices.delete({
            where: { id },
        });
    };

    // hasGameGroups = async (categoryId: string) => {
    //     const count = await prisma.gameGroups.count({
    //         where: { categoryId },
    //     });
    //     return count > 0;
    // };

    // getAll = async () => {
    //     const result = await prisma.gameServices.findMany({
    //         where: {
    //             active: 1,
    //         },
    //         orderBy: {
    //             createdAt: "desc",
    //         },
    //     });
    //     return result;
    // };
}

const gameServiceRepository = new GameServiceRepository();
export default gameServiceRepository;
