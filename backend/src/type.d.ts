import User from "./schemas/user.schema";
import { TokenPayload } from "./models/requests/User.requests";
import { RoleType } from "./constants/enums";
interface UserTypePayload {
    userId: string;
    role: RoleType;
    [key: string]: any;
}
declare module "express" {
    interface Request {
        user?: UserTypePayload;
        decoded_authorization?: TokenPayload;
        decoded_refresh_token?: TokenPayload;
        decoded_email_verify_token?: TokenPayload;
        decoded_forgot_password_token?: TokenPayload;
        tweet?: Tweet;
    }
}
