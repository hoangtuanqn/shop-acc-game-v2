import z from "zod/v3";

// Schema cho CREATE game account
export const gameAccountSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1, "Tên tài khoản không được để trống").max(255).nonempty(),
        accountName: z.string().trim().min(1, "Tên đăng nhập không được để trống").max(255).nonempty(),
        password: z.string().trim().min(1, "Mật khẩu không được để trống").nonempty(),
        price: z.number().positive("Giá tiền phải lớn hơn 0"),
        details: z.record(z.any()),
        thumb: z.string().url("Thumbnail phải là một URL hợp lệ"),
        images: z.array(z.string()),
    }),
    params: z.object({
        id: z.string().uuid("ID group không hợp lệ"),
    }),
});

export const editGameAccountSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1).max(255),
        accountName: z.string().trim().min(1).max(255).nonempty(),
        password: z.string().trim().min(1).max(255).nonempty(),
        price: z.number().positive("Giá tiền phải lớn hơn 0"),
        details: z.string().optional(),
        thumb: z.string().url("Thumbnail phải là một URL hợp lệ"),
        images: z.string(),
    }),
    params: z.object({
        id: z.string().uuid("ID account không hợp lệ"),
    }),
});

export const deleteGameAccountSchema = z.object({
    params: z.object({
        id: z.string().uuid("ID account không hợp lệ"),
    }),
});

export const getGameAccountsSchema = z.object({
    params: z.object({
        groupId: z.string().uuid("Group ID không hợp lệ"),
    }),
});

export const getOneAccountSchema = z.object({
    params: z.object({
        id: z.string().uuid("Account ID không hợp lệ"),
    }),
});
