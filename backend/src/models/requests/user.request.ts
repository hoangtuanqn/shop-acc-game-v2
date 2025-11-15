import { JwtPayload } from "jsonwebtoken";
import { RoleType, TokenType } from "~/constants/enums";
import z from "zod/v3";
import {
    changePasswordSchema,
    forgotPasswordSchema,
    loginSchema,
    refreshTokenSchema,
    registerSchema,
    resetPasswordParamsSchema,
    resetPasswordSchema,
    verifyEmailParamsSchema,
} from "../auth/auth.schema";

export type RegisterRequestBody = z.infer<typeof registerSchema>["body"];
export type LoginRequestBody = z.infer<typeof loginSchema>["body"];
export type ForgotPasswordRequestBody = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordRequestParams = z.infer<typeof resetPasswordParamsSchema>["params"];
export type ResetPasswordRequestBody = z.infer<typeof resetPasswordSchema>["body"];
export type RefreshTokenRequestBody = z.infer<typeof refreshTokenSchema>["body"];
export type VerifyEmailRequestParams = z.infer<typeof verifyEmailParamsSchema>["params"];
export type ChangePasswordRequestBody = z.infer<typeof changePasswordSchema>["body"];
export interface TokenPayload extends JwtPayload {
    userId: string;
    type: TokenType;
    role: RoleType;
    exp: number;
    iat: number;
}
