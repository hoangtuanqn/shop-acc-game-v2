import { ParamsDictionary } from "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";
import { extend } from "lodash";
import { TokenType, UserVerifyStatus } from "~/constants/enums";

export interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    date_of_birth: string;
}
export interface LoginRequestBody {
    email: string;
    password: string;
}
export interface RefreshTokenBody {
    refresh_token: string;
}
export interface VerifyEmailBody {
    verify_token: string;
}
export interface TokenPayload extends JwtPayload {
    userId: string;
    token_type: TokenType;
    verify: UserVerifyStatus;
    exp: number;
    iat: number;
}
export interface ForgotPasswordBody {
    email: string;
}
export interface VerifyForgotPasswordBody {
    forgot_email_token: string;
}
export interface ResetPasswordBody extends VerifyForgotPasswordBody {
    password: string;
    confirm_password: string;
}

export interface UpdateMeRequestBody {
    name?: string;
    date_of_birth?: string;
    bio?: string;
    location?: string;
    website?: string;
    username?: string;
    avatar?: string;
    cover_photo?: string;
}
export interface FollowRequestBody {
    followed_user_id: string;
}
export interface UnfollowParams extends ParamsDictionary {
    user_id: string;
}
export interface ChangePasswordRequestBody {
    old_password: string;
    password: string;
    confirm_password: string;
}
