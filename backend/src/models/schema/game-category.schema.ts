import z from "zod/v3";

export const gameCategorySchema = z.object({
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
                message: "Trạng thái không hợp lệ",
            })
            .default(1),
    }),
});

export const editGameCategorySchema = z.object({
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
                message: "Trạng thái không hợp lệ",
            })
            .default(1),
    }),
    params: z.object({
        id: z.string().uuid("ID danh mục không hợp lệ"),
    }),
});

export const deleteGameCategorySchema = z.object({
    params: z.object({
        id: z.string(),
    })
})

