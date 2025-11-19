import prisma from "~/configs/prisma";
import ServicePackage from "~/schemas/service-package.schema";

class ServicePackageRepository {
    create = async (gameServiceId: string, data: { name: string; price: number; active?: number }) => {
        return prisma.servicePackages.create({
            data: new ServicePackage({
                gameServiceId,
                ...data,
            }),
        });
    };

    findById = async (id: string) => {
        return prisma.servicePackages.findUnique({
            where: { id },
            include: { service: true },
        });
    };

    edit = async (id: string, data: { name?: string; price?: number; active?: number }) => {
        return prisma.servicePackages.update({
            where: { id },
            data,
        });
    };

    delete = async (id: string) => {
        return prisma.servicePackages.delete({
            where: { id },
        });
    };

    getByGameServiceId = async (gameServiceId: string) => {
        return prisma.servicePackages.findMany({
            where: { gameServiceId },
            orderBy: { createdAt: "desc" },
        });
    };
}

const servicePackageRepository = new ServicePackageRepository();
export default servicePackageRepository;
