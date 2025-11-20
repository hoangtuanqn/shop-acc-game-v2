import prisma from "~/configs/prisma";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import { EditGameServiceRequestBody } from "~/models/requests/game-service.request";
import gameServiceRepository from "~/repositories/game-service.repository";
import GameService from "~/schemas/game-service.schema";

class GameServiceService {
    create = async (data: { name: string; thumbnail?: string; description?: string; active?: number }) => {
        return await gameServiceRepository.create(data);
    };

    edit = async (id: string, data: EditGameServiceRequestBody) => {
        // Kiểm tra service có tồn tại không
        const serviceExisted = await gameServiceRepository.findById(id);
        if (!serviceExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Game service không tồn tại trong hệ thống!",
            });
        }

        return await gameServiceRepository.edit(id, data);
    };

    delete = async (id: string) => {
        // Kiểm tra service có tồn tại không
        const serviceExisted = await gameServiceRepository.findById(id);
        if (!serviceExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Game service không tồn tại trong hệ thống!",
            });
        }

        return await gameServiceRepository.delete(id);
    };

    // hasGameGroups = async (categoryId: string) => {
    //     const count = await prisma.gameGroups.count({
    //         where: { categoryId },
    //     });
    //     return count > 0;
    // };

    getAll = async () => {
        return await gameServiceRepository.getAll();
    };
}

const gameServiceService = new GameServiceService();
export default gameServiceService;
