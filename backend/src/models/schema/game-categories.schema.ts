import z from "zod/v3";

export const gameCategoriesSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(1, "Tên danh mục không được để trống")
            .max(30, "Tên danh mục không được vượt quá 30 ký tự")
            .nonempty(),
        thumbnail: z.string().url("Thumbnail phải là một URL hợp lệ"),
        active: z
            .number()
            .refine((val) => val === 0 || val === 1, {
                message: "Trạng thái hoạt động phải là 0 hoặc 1",
            })
            .default(1),
        slug: z.string().trim().optional(),
    }),
});
