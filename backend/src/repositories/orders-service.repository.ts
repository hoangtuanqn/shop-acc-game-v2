import prisma from "~/configs/prisma";
import OrdersService from "~/schemas/orders-service.schema";
import { paginate } from "~/utils/pagination";

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

    // ...existing code...
    updateStatus = async (id: string, status: number) => {
        return prisma.ordersService.update({
            where: { id },
            data: { status },
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

    // Admin: Lấy tất cả đơn service, có phân trang
    getAllOrdersAdmin = async (params: { page?: number; limit?: number }) => {
        const { page, limit } = params;
        return paginate<any>(prisma.ordersService, {
            page,
            limit,
            orderBy: { createdAt: "desc" },
            // Có thể select các trường cần thiết, ví dụ:
            select: {
                id: true,
                gameServiceId: true,
                servicePackageId: true,
                buyerId: true,
                accountName: true,
                password: true,
                price: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                // Nếu muốn lấy thêm thông tin liên kết:
                service: true,
                package: true,
                user: true,
            },
        });
    };
}

const ordersServiceRepository = new OrdersServiceRepository();
export default ordersServiceRepository;
