import z from "zod/v3";

export const registerSchema = z.object({
    body: z
        .object({
            username: z
                .string()
                .trim()
                .min(3, "Username phải >= 4 ký tự")
                .max(20, "Username phải <= 20 ký tự")
                .nonempty(),
            email: z.string().trim().email("Email không hợp lệ"),
            password: z
                .string()
                .min(4, "Password phải >= 4 ký tự")
                .regex(/[0-9]/, "Password phải chứa ít nhất 1 số")
                .regex(
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+=\-]).{8,}$/,
                    "Password phải chứa ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt",
                ),
            confirm_password: z.string(),
        })
        .refine((data) => data.password === data.confirm_password, {
            message: "Mật khẩu nhập lại không khớp",
            path: ["confirm_password"],
        }),
});
export const loginSchema = z.object({
    body: z.object({
        username: z.string().trim().nonempty(),
        password: z.string().nonempty(),
    }),
});
