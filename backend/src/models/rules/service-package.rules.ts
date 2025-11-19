import z from "zod/v3";

export const createServicePackageSchema = z.object({
    params: z.object({
        gameServiceId: z.string().uuid("Game service ID không hợp lệ"),
    }),
    body: z.object({
        name: z.string().min(1, "Tên gói không được để trống"),
        price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
        active: z.number().min(0).max(1).optional(),
    }),
});

export const editServicePackageSchema = z.object({
    params: z.object({
        id: z.string().uuid("Package ID không hợp lệ"),
    }),
    body: z.object({
        name: z.string().min(1).optional(),
        price: z.number().min(0).optional(),
        active: z.number().min(0).max(1).optional(),
    }),
});

export const deleteServicePackageSchema = z.object({
    params: z.object({
        id: z.string().uuid("Package ID không hợp lệ"),
    }),
});

export const getPackagesByServiceSchema = z.object({
    params: z.object({
        gameServiceId: z.string().uuid("Game service ID không hợp lệ"),
    }),
});
