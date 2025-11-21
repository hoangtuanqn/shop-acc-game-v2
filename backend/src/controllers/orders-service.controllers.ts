export const updateOrderStatusAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const result = await ordersServiceService.updateOrderStatusAdmin(orderId, status);
        return res.status(HTTP_STATUS.OK).json({
            message: "Cập nhật trạng thái đơn hàng thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
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

export const getAllOrdersAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const result = await ordersServiceService.getAllOrdersAdmin(page, limit);
        return res.status(HTTP_STATUS.OK).json({
            message: "Lấy danh sách đơn service thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
