import { ExpiresInTokenType, TokenType } from "~/constants/enums";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import userRespository from "~/repositories/user.repository";
import AlgoCrypoto from "~/utils/crypto";
import AlgoJwt from "~/utils/jwt";
import { ForgotPasswordRequestBody, LoginRequestBody, RegisterRequestBody } from "~/models/requests/user.request";
import Helpers from "~/utils/helpers";
import redisService from "./redis.service";

class AuthService {
    public create = async (data: RegisterRequestBody) => {
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
            this.signToken({ userId: result.id, type: TokenType.AccessToken }),
            this.signToken({
                userId: result.id,
                type: TokenType.RefreshToken,
                expiresIn: ExpiresInTokenType.RefreshToken,
            }),
        ]);

        // Lưu lại refresh token vào redis
        await this.storeRefreshTokenInRedis(result.id, refreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    };

    public login = async (data: LoginRequestBody) => {
        const { username, password } = data;
        const accountExisted = await userRespository.findByUsername(username);
        if (!accountExisted || !(await AlgoCrypoto.verifyPassword(password, accountExisted.password))) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Thông tin đăng nhập của bạn không hợp lệ!",
            });
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken({
                userId: accountExisted.id,
                type: TokenType.AccessToken,
            }),
            this.signToken({
                userId: accountExisted.id,
                type: TokenType.RefreshToken,
                expiresIn: ExpiresInTokenType.RefreshToken,
            }),
        ]);
        // Lưu lại refresh token vào redis
        await this.storeRefreshTokenInRedis(accountExisted.id, refreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    };

    public forgotPassword = async ({ email }: ForgotPasswordRequestBody) => {
        const accountExisted = await userRespository.findByEmail(email);

        if (accountExisted) {
            const forgotPasswordToken = await this.signToken({
                userId: accountExisted.id,
                type: TokenType.ForgotPasswordToken,
            });

            await userRespository.forgotPassword(email, forgotPasswordToken);
        }

        return true;
    };

    public getLinkResetPassword = async ({ token }: { token: string }) => {
        const tokenExisted = await userRespository.findTokenResetPassword(token);

        if (!tokenExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Đường dẫn không hợp lệ!",
            });
        }
        const payload = await AlgoJwt.verifyToken({ token });

        if (!Helpers.isTypeToken(payload, TokenType.ForgotPasswordToken)) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Đường dẫn không hợp lệ hoặc đã kết hạn!",
            });
        }

        return tokenExisted;
    };
    public resetPassword = async (token: string, password: string) => {
        const passwordHash = await AlgoCrypoto.hashPassword(password);
        try {
            const resetPassword = await userRespository.resetPasswordByToken(token, passwordHash);
            return resetPassword;
        } catch (error) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Không tìm thấy thông tin cần đặt lại mật khẩu!",
            });
        }
    };

    private signToken = ({
        userId,
        type,
        expiresIn = ExpiresInTokenType.AccessToken * 1000,
    }: {
        userId: string;
        type: TokenType;
        expiresIn?: number;
    }) => {
        return AlgoJwt.signToken({
            payload: { type, userId },
            options: { expiresIn: expiresIn * 1000 }, // convert seconds to mili seconds
        }) as Promise<string>;
    };

    private storeRefreshTokenInRedis = async (token: string, userId: string) => {
        return await redisService.set(`refreshToken:${userId}`, token, ExpiresInTokenType.RefreshToken);
    };
}
const authService = new AuthService();
export default authService;
