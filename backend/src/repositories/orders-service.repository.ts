import prisma from "~/configs/prisma";
import OrdersService from "~/schemas/orders-service.schema";

class OrdersServiceRepository {
    create = async (data: {
        gameServiceId: string;
        servicePackageId: string;
        buyerId: string;
        accountName: string;
        password: string;
        price: number;
    }) => {
        return prisma.ordersService.create({
            data: new OrdersService(data),
        });
    };

    findById = async (id: string) => {
        return prisma.ordersService.findUnique({
            where: { id },
            include: {
                service: true,
                package: true,
            },
        });
    };

    getMyOrders = async (userId: string) => {
        return prisma.ordersService.findMany({
            where: { buyerId: userId },
            orderBy: { createdAt: "desc" },
            include: {
                service: true,
                package: true,
            },
        });
    };
}

const ordersServiceRepository = new OrdersServiceRepository();
export default ordersServiceRepository;
