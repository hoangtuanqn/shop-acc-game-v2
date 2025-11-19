import z from "zod/v3";

export const gameGroupSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Tên danh mục không được để trống")
            .max(30, "Tên danh mục không vượt quá 30 ký tự")
            .nonempty(),
        categoryId: z.string(),
        thumbnail: z.string().url("Thumbnail phải là một URL hợp lệ"),
        active: z
            .number()
            .refine((val) => val === 0 || val === 1, {
                message: "Trạng thái không hợp lệ",
            })
            .default(1),
    }),
});

export const editGameGroupSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(1, "Tên danh mục không được để trống")
            .max(30, "Tên danh mục không vượt quá 30 ký tự")
            .nonempty(),
        categoryId: z.string(),
        thumbnail: z.string().url("Thumbnail phải là một URL hợp lệ"),
        active: z
            .number()
            .refine((val) => val === 0 || val === 1, {
                message: "Trạng thái không hợp lệ",
            })
            .default(1),
    }),
    params: z.object({
        id: z.string().uuid("ID category không hợp lệ"),
    }),
});

export const delCategoryParamsSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
});

export const getGameGroupsByCategorySchema = z.object({
    params: z.object({
        categoryId: z.string().uuid("Category ID không hợp lệ"),
    }),
    query: z
        .object({
            page: z
                .string()
                .optional()
                .transform((val) => (val ? parseInt(val, 10) : 1)),

            limit: z
                .string()
                .optional()
                .transform((val) => (val ? parseInt(val, 10) : 10)),
        })
        .refine((data) => !data.page || (data.page > 0 && !isNaN(data.page)), {
            message: "dữ liệu không hợp lệ",
            path: ["page"],
        })
        .refine((data) => !data.limit || (data.limit > 0 && data.limit <= 100 && !isNaN(data.limit)), {
            message: "dữ liệu không hợp lệ",
            path: ["limit"],
        }),
});
 