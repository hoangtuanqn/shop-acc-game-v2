import z from "zod/v3";

// Schema cho CREATE game account
export const gameAccountSchema = z.object({
    body: z.object({
        accountName: z.string().trim().min(1, "Tên đăng nhập không được để trống").nonempty(),
        password: z.string().trim().min(1, "Mật khẩu không được để trống").nonempty(),
        price: z.union([z.bigint(), z.number()]).refine((val) => val > 0, {
            message: "Giá tiền phải lớn hơn 0",
        }),
        status: z
            .number()
            .optional(),
        buyerId: z.string().uuid().optional(),
        details: z.string().optional(),
        thumb: z.string().url("Thumbnail phải là một URL hợp lệ"),
        images: z.string().url("Ảnh phải là một URL hợp lệ"),
    }),
    params: z.object({
        id: z.string().uuid("ID group không hợp lệ"),
    }),
});

