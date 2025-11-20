import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import servicePackageRepository from "~/repositories/service-package.repository";
import prisma from "~/configs/prisma";

class ServicePackageService {
    create = async (gameServiceId: string, data: { name: string; price: number; active?: number }) => {
        // Kiểm tra game service có tồn tại không
        const gameService = await prisma.gameServices.findUnique({
            where: { id: gameServiceId },
        });

        if (!gameService) {
            throw new ErrorWithStatus({
                message: "Game service không tồn tại",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }

        return servicePackageRepository.create(gameServiceId, data);
    };

    edit = async (id: string, data: { name?: string; price?: number; active?: number }) => {
        const packageExists = await servicePackageRepository.findById(id);

        if (!packageExists) {
            throw new ErrorWithStatus({
                message: "Service package không tồn tại",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }

        return servicePackageRepository.edit(id, data);
    };

    delete = async (id: string) => {
        const packageExists = await servicePackageRepository.findById(id);

        if (!packageExists) {
            throw new ErrorWithStatus({
                message: "Service package không tồn tại",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }

        return servicePackageRepository.delete(id);
    };

    getByGameServiceId = async (gameServiceId: string) => {
        // Kiểm tra game service có tồn tại không
        const gameService = await prisma.gameServices.findUnique({
            where: { id: gameServiceId },
        });

        if (!gameService) {
            throw new ErrorWithStatus({
                message: "Game service không tồn tại",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }

        return servicePackageRepository.getByGameServiceId(gameServiceId);
    };

    getById = async (id: string) => {
        const pkg = await servicePackageRepository.findById(id);
        if (!pkg) {
            throw new ErrorWithStatus({
                message: "Service package không tồn tại",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }
        return pkg;
    };
}

const servicePackageService = new ServicePackageService();
export default servicePackageService;
