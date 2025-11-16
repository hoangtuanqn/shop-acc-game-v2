import z from "zod/v3";

export const gameGroupSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Tên danh mục không được để trống")
            .max(30, "Tên danh mục không vượt quá 30 ký tự")
            .nonempty(),
        categoryId: z.string().min(1, "Category ID không tồn tại"),
        thumbnail: z.string().url("Thumbnail phải là một URL hợp lệ"),
        active: z
            .number()
            .refine((val) => val === 0 || val === 1, {
                message: "Trạng thái không hợp lệ",
            })
            .default(1),
    }),
});
