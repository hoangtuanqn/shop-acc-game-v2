import z from "zod/v3";

export const createOrderServiceSchema = z.object({
    params: z.object({
        gameServiceId: z.string().uuid("Game service ID không hợp lệ"),
    }),
    body: z.object({
        servicePackageId: z.string().uuid("Service package ID không hợp lệ"),
        accountName: z.string().min(1, "Tài khoản không được để trống"),
        password: z.string().min(1, "Mật khẩu không được để trống"),
    }),
});

export const getOrderDetailSchema = z.object({
    params: z.object({
        id: z.string().uuid("Order ID không hợp lệ"),
    }),
});
