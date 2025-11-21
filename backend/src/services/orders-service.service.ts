import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import ordersServiceRepository from "~/repositories/orders-service.repository";
import userRepository from "~/repositories/user.repository";
import prisma from "~/configs/prisma";

class OrdersServiceService {
    updateOrderStatusAdmin = async (orderId: string, status: number) => {
        // Kiểm tra hợp lệ
        if (![0, 1, 2].includes(status)) {
            throw new ErrorWithStatus({
                message: "Trạng thái không hợp lệ!",
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }
        // Kiểm tra đơn hàng tồn tại
        const order = await ordersServiceRepository.findById(orderId);
        if (!order) {
            throw new ErrorWithStatus({
                message: "Đơn hàng không tồn tại!",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }
        // Cập nhật status
        return ordersServiceRepository.updateStatus(orderId, status);
    };

    createOrder = async (data: {
        gameServiceId: string;
        servicePackageId: string;
        accountName: string;
        password: string;
        userId: string;
    }) => {
        // 1. Lấy thông tin service package
        const servicePackage = await prisma.servicePackages.findUnique({
            where: { id: data.servicePackageId },
            include: { service: true },
        });

        if (!servicePackage) {
            throw new ErrorWithStatus({
                message: "Gói dịch vụ không tồn tại",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }

        // Kiểm tra servicePackage có thuộc gameService không
        if (servicePackage.gameServiceId !== data.gameServiceId) {
            throw new ErrorWithStatus({
                message: "Gói dịch vụ không thuộc game service này",
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }

        if (servicePackage.active !== 1) {
            throw new ErrorWithStatus({
                message: "Gói dịch vụ không khả dụng",
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }

        // 2. Kiểm tra user có đủ tiền không
        const user = await userRepository.findById(data.userId);
        if (!user) {
            throw new ErrorWithStatus({
                message: "User không tồn tại",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }

        if (user.balance < servicePackage.price) {
            throw new ErrorWithStatus({
                message: `Số dư không đủ! Bạn cần ${servicePackage.price - user.balance} VND nữa`,
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }

        // 3. Trừ tiền user
        await userRepository.updateBalance(data.userId, user.balance - servicePackage.price);

        // 4. Tạo đơn
        const result = await ordersServiceRepository.create({
            gameServiceId: data.gameServiceId,
            servicePackageId: data.servicePackageId,
            buyerId: data.userId,
            accountName: data.accountName,
            password: data.password,
            price: servicePackage.price,
        });

        return result;
    };

    getMyOrders = async (userId: string) => {
        return ordersServiceRepository.getMyOrders(userId);
    };

    getOrderDetail = async (orderId: string, userId: string) => {
        const order = await ordersServiceRepository.findById(orderId);

        if (!order) {
            throw new ErrorWithStatus({
                message: "Đơn hàng không tồn tại",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }

        // Chỉ cho phép xem đơn của chính mình
        if (order.buyerId !== userId) {
            throw new ErrorWithStatus({
                message: "Bạn không có quyền xem đơn hàng này",
                status: HTTP_STATUS.FORBIDDEN,
            });
        }

        return order;
    };

    public getAllOrdersAdmin = async (page?: number, limit?: number) => {
        return ordersServiceRepository.getAllOrdersAdmin({ page, limit });
    };
}

const ordersServiceService = new OrdersServiceService();
export default ordersServiceService;
