import z from "zod/v3";
const jwtSchema = z.string().regex(/^[^.]+\.[^.]+\.[^.]+$/, "Token không hợp lệ!");
const passwordSchema = z
    .string()
    .min(4, "Password phải >= 4 ký tự")
    .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+=\-]).{8,}$/,
        "Password phải chứa ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt",
    );
export const registerSchema = z.object({
    body: z
        .object({
            username: z
                .string()
                .trim()
                .min(4, "Username phải >= 4 ký tự")
                .max(20, "Username phải <= 20 ký tự")
                .nonempty(),
            email: z.string().trim().email("Email không hợp lệ"),
            password: passwordSchema,
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
export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().trim().email("Email không hợp lệ"),
    }),
});
export const resetPasswordParamsSchema = z.object({
    params: z.object({
        token: jwtSchema,
    }),
});
export const resetPasswordSchema = z.object({
    body: z
        .object({
            password: passwordSchema,
            confirm_password: z.string(),
        })
        .refine((data) => data.password === data.confirm_password, {
            message: "Mật khẩu nhập lại không khớp",
            path: ["confirm_password"],
        }),
});
