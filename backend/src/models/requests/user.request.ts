import { JwtPayload } from "jsonwebtoken";
import { TokenType, UserVerifyStatus } from "~/constants/enums";
import { loginSchema, registerSchema } from "../auth/auth.schema";
import z from "zod/v3";

export type RegisterRequestBody = z.infer<typeof registerSchema>["body"];
export type LoginRequestBody = z.infer<typeof loginSchema>["body"];
export interface TokenPayload extends JwtPayload {
    userId: string;
    token_type: TokenType;
    verify: UserVerifyStatus;
    exp: number;
    iat: number;
}
