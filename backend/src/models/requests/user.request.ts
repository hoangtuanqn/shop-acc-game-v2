import { JwtPayload } from "jsonwebtoken";
import { TokenType, UserVerifyStatus } from "~/constants/enums";
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordParamsSchema,
    resetPasswordSchema,
} from "../auth/auth.schema";
import z from "zod/v3";

export type RegisterRequestBody = z.infer<typeof registerSchema>["body"];
export type LoginRequestBody = z.infer<typeof loginSchema>["body"];
export type ForgotPasswordRequestBody = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordRequestParams = z.infer<typeof resetPasswordParamsSchema>["params"];
export type ResetPasswordRequestBody = z.infer<typeof resetPasswordSchema>["body"];
export interface TokenPayload extends JwtPayload {
    userId: string;
    type: TokenType;
    verify: UserVerifyStatus;
    exp: number;
    iat: number;
}
