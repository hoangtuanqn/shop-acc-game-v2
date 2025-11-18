import User from "./schemas/user.schema";
import { TokenPayload } from "./models/requests/User.requests";
import { RoleType } from "./constants/enums";

declare module "express" {
    interface Request {
        userId?: string;
        role?: RoleType;
    }
}
