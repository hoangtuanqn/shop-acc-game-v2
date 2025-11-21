// ...existing code...
// ...existing code...
import { Router } from "express";
import { auth } from "~/middlewares/auth.middlewares";
import * as ordersServiceController from "~/controllers/orders-service.controllers";
import { validate } from "~/utils/validation";
import { createOrderServiceSchema, getOrderDetailSchema } from "~/models/rules/order-service.rules";
import { checkAdmin } from "~/middlewares/checkAdmin.middlewares";

const ordersServiceRouter = Router();

// Đặt đơn cho 1 game service cụ thể (cần auth)
ordersServiceRouter.post(
    "/:gameServiceId",
    auth,
    validate(createOrderServiceSchema),
    ordersServiceController.createOrder,
);

// Xem danh sách đơn hàng của mình (cần auth)
ordersServiceRouter.get("/my-orders", auth, ordersServiceController.getMyOrders);

// Xem chi tiết 1 đơn hàng (cần auth)
ordersServiceRouter.get("/:id", auth, validate(getOrderDetailSchema), ordersServiceController.getOrderDetail);

// xem all lịch sử đơn cày admin
ordersServiceRouter.get("/admin/all", checkAdmin, ordersServiceController.getAllOrdersAdmin);

// Admin cập nhật trạng thái đơn hàng
ordersServiceRouter.put("/admin/:id/status", checkAdmin, ordersServiceController.updateOrderStatusAdmin);

export default ordersServiceRouter;
