import { TokenType } from "~/constants/enums";
import { TokenPayload } from "~/models/requests/user.request";

export default class Helpers {
    static isTypeToken = (payload: TokenPayload, type: TokenType = TokenType.ForgotPasswordToken) => {
        return payload.type === type;
    };
    static converFirstUpper = (val: string): string => {
        return val.charAt(0).toUpperCase() + val.slice(1).toLocaleLowerCase();
    };
}
