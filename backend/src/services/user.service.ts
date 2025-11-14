import { TokenType, UserVerifyStatus } from "~/constants/enums";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import { RegisterRequestBody } from "~/models/requests/user.request";
import userRespository from "~/repositories/user.repository";
import AlgoCrypoto from "~/utils/crypto";
import AlgoJwt from "~/utils/jwt";

class UserService {
    create = async (data: RegisterRequestBody) => {
        const { email, username, password } = data;

        const emailExisted = await userRespository.findByEmail(email);
        if (emailExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.CONFLICT,
                message: "Địa chỉ email của bạn đã tồn tại trong hệ thống!",
            });
        }

        const usernameExisted = await userRespository.findByUsername(username);

        if (usernameExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.CONFLICT,
                message: "Tên tài khoản của bạn đã tồn tại trong hệ thống!",
            });
        }

        const passwordHash = await AlgoCrypoto.hashPassword(password);
        const result = await userRespository.create({
            email,
            username,
            password: passwordHash,
        });

        const [accessToken, refreshToken] = await Promise.all([
            this.signToken({ userId: result.id, verify: UserVerifyStatus.Verified, type: TokenType.AccessToken }),
            this.signToken({ userId: result.id, verify: UserVerifyStatus.Verified, type: TokenType.RefreshToken }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    };

    private signToken = ({ userId, verify, type }: { userId: string; verify: UserVerifyStatus; type: TokenType }) => {
        return AlgoJwt.signToken({
            payload: { type, userId, verify },
            options: { expiresIn: "15m" },
        }) as Promise<string>;
    };
}
const userService = new UserService();
export default userService;
