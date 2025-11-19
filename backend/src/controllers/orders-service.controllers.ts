import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
import ordersServiceService from "~/services/orders-service.service";
import { CreateOrderServiceRequestBody } from "~/models/requests/orders-service.request";

export const createOrder = async (
    req: Request<any, any, CreateOrderServiceRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.userId!;
        const gameServiceId = req.params.gameServiceId;

        const result = await ordersServiceService.createOrder({
            gameServiceId,
            ...req.body,
            userId,
        });

        return res.status(HTTP_STATUS.CREATED).json({
            message: "Đặt đơn thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;
        const result = await ordersServiceService.getMyOrders(userId);

        return res.status(HTTP_STATUS.OK).json({
            message: "Lấy danh sách đơn hàng thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const getOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;
        const orderId = req.params.id;
        const result = await ordersServiceService.getOrderDetail(orderId, userId);

        return res.status(HTTP_STATUS.OK).json({
            message: "Lấy chi tiết đơn hàng thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
