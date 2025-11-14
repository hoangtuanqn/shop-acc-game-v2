import { JwtPayload } from "jsonwebtoken";
import { TokenType, UserVerifyStatus } from "~/constants/enums";

export interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
}
export interface TokenPayload extends JwtPayload {
    userId: string;
    token_type: TokenType;
    verify: UserVerifyStatus;
    exp: number;
    iat: number;
}
