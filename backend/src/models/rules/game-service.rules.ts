import z from "zod/v3";

export const gameServiceSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(1, "Tên dịch vụ không được để trống")
            .max(30, "Tên dịch vụ không được vượt quá 30 ký tự")
            .nonempty(),
        thumbnail: z.string().url("Thumbnail phải là một URL hợp lệ"),
        description: z
            .string()
            .trim()
            .min(1, "Mô tả dịch vụ không được để trống")
            .max(500, "Mô tả dịch vụ không được vượt quá 500 ký tự")
            .nonempty(),
        active: z
            .number()
            .refine((val) => val === 0 || val === 1, {
                message: "Trạng thái không hợp lệ",
            })
            .default(1),
    }),
});

export const editGameServiceSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(1, "Tên dịch vụ không được để trống")
            .max(30, "Tên dịch vụ không được vượt quá 30 ký tự")
            .nonempty(),
        thumbnail: z.string().url("Thumbnail phải là một URL hợp lệ"),
        description: z
            .string()
            .trim()
            .min(1, "Mô tả dịch vụ không được để trống")
            .max(500, "Mô tả dịch vụ không được vượt quá 500 ký tự")
            .nonempty(),
        active: z
            .number()
            .refine((val) => val === 0 || val === 1, {
                message: "Trạng thái không hợp lệ",
            })
            .default(1),
    }),
    params: z.object({
        id: z.string().uuid("ID dịch vụ không hợp lệ"),
    }),
});

export const deleteGameServiceSchema = z.object({
    params: z.object({
        id: z.string().uuid("ID dịch vụ không hợp lệ"),
    }),
});
