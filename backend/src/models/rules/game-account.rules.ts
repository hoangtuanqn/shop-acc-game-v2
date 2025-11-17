import z from "zod/v3";

// Schema cho CREATE game account
export const gameAccountSchema = z.object({
    body: z.object({
        accountName: z.string().trim().min(1, "Tên đăng nhập không được để trống").max(255).nonempty(),
        password: z.string().trim().min(1, "Mật khẩu không được để trống").nonempty(),
        price: z.union([z.bigint(), z.number()]).refine((val) => val > 0, {
            message: "Giá tiền phải lớn hơn 0",
        }),
        status: z.number().refine((val) => val === 0 || val === 1, {
            message: "Trạng thái không hợp lệ",
        }),
        buyerId: z.string().uuid().optional(),
        details: z.string().optional(),
        thumb: z.string().url("Thumbnail phải là một URL hợp lệ"),
        images: z.string(),
    }),
    params: z.object({
        id: z.string().uuid("ID group không hợp lệ"),
    }),
});

export const editGameAccountSchema = z.object({
    body: z.object({
        accountName: z.string().trim().min(1).max(255).nonempty(),
        password: z.string().trim().min(1).max(255).nonempty(),
        price: z
            .union([z.bigint(), z.number()])
            .refine((val) => val > 0, {
                message: "Giá tiền phải lớn hơn 0",
            })
            .optional(),
        status: z.number().refine((val) => val === 0 || val === 1, {
            message: "Trạng thái không hợp lệ",
        }),
        buyerId: z.string().uuid().optional(),
        details: z.string().optional(),
        thumb: z.string().url("Thumbnail phải là một URL hợp lệ"),
        images: z.string(),
    }),
    params: z.object({
        id: z.string().uuid("ID account không hợp lệ"),
    }),
});
