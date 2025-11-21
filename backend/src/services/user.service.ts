import { ExpiresInTokenType, TokenType } from "~/constants/enums";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import userRespository from "~/repositories/user.repository";
import AlgoCrypoto from "~/utils/crypto";
import AlgoJwt from "~/utils/jwt";
import { ForgotPasswordRequestBody, LoginRequestBody, RegisterRequestBody } from "~/models/requests/user.request";
import Helpers from "~/utils/helpers";
import redisClient from "~/configs/redis";
import pwsHisRepository from "~/repositories/password-history.repository";
import mailer from "~/utils/mailer";

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

        const isPwdExisted = await pwsHisRepository.checkExisted(result.id, password);
        if (isPwdExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Mật khẩu này đã tồn tại trong quá khứ. Hãy đặt mật khẩu khác an toàn hơn!",
            });
        }

        // Lưu mk người dùng vô bảng lịch sử
        await pwsHisRepository.save(result.id, passwordHash);
        const tokenVerify = await this.signToken({
            userId: result.id,
            type: TokenType.EmailVerifyToken,
            expiresIn: ExpiresInTokenType.EmailVerifyToken,
        });
        const verificationLink = `${process.env.CLIENT_URL}/verify-email/${tokenVerify}`;
        await mailer.sendMail({
            to: email,
            subject: "Xác minh tài khoản của bạn trên hệ thống " + process.env.APP_NAME,
            recipient_name: result.username,
            main_content_html: `
                <p style="margin-bottom: 25px;">Cảm ơn bạn đã đăng ký tài khoản <b>${process.env.APP_NAME}</b>. Tài khoản của bạn hiện chưa được kích hoạt.</p>
                <p>Vui lòng nhấp vào nút bên dưới để <b>xác minh địa chỉ email</b> và hoàn tất quá trình đăng ký.</p>
                <p style="font-style: italic; color: #cc0000;">Lưu ý: Liên kết này sẽ hết hạn sau 24 giờ.</p>
            `,
            sub_content_html: `
                <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
            `,
            cta_text: "Xác minh ngay",
            url: verificationLink,
        });
        await userRespository.updateTokenVerify(result.id, tokenVerify);
        return await this.signAccesAndRefreshToken(result.id);
    };

    public login = async (data: LoginRequestBody) => {
        const { username, password } = data;

        const accountExisted = await userRespository.findByUsername(username);
        if (accountExisted) {
            const countFailed = +((await redisClient.get(`login_fail:${username}`)) || 0);
            const ttl = await redisClient.getTTL(`login_fail:${username}`);
            if (countFailed >= 5) {
                throw new ErrorWithStatus({
                    status: HTTP_STATUS.FORBIDDEN,
                    message: `Không thể đăng nhập vào tài khoản của bạn do vượt quá số lần thử đăng nhập cho phép. Vui lòng thử lại sau ${Math.ceil(
                        ttl / 60,
                    )} phút.`,
                });
            }
        }
        if (!accountExisted || !(await AlgoCrypoto.verifyPassword(password, accountExisted.password))) {
            const incr = await redisClient.increment(`login_fail:${username}`);
            if (incr >= 5) {
                await redisClient.setExpire(`login_fail:${username}`, 15 * 60);
                throw new ErrorWithStatus({
                    status: HTTP_STATUS.FORBIDDEN,
                    message: `Không thể đăng nhập vào tài khoản của bạn do vượt quá số lần thử đăng nhập cho phép. Vui lòng thử lại sau 15 phút.`,
                });
            }
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: `Thông tin đăng nhập của bạn không hợp lệ, bạn còn ${5 - incr} lần thử!`,
            });
        }
        await redisClient.del(`login_fail:${username}`);
        return await this.signAccesAndRefreshToken(accountExisted.id);
    };

    public forgotPassword = async ({ email }: ForgotPasswordRequestBody) => {
        const result = await userRespository.findByEmail(email);
        if (!result) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Không tìm thấy tài khoản với địa chỉ email đã cung cấp!",
            });
        }

        if (result) {
            const forgotPasswordToken = await this.signToken({
                userId: result.id,
                type: TokenType.ForgotPasswordToken,
                expiresIn: ExpiresInTokenType.ForgotPasswordToken,
            });
            const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${forgotPasswordToken}`;
            await mailer.sendMail({
                to: email,
                subject: "Yêu cầu Đặt lại Mật khẩu trên hệ thống " + process.env.APP_NAME,
                recipient_name: result.username,
                main_content_html: `
        <p style="margin-bottom: 25px;">Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản <b>${process.env.APP_NAME}</b> của mình.</p>
        <p>Vui lòng nhấp vào nút bên dưới để tiến hành <b>tạo mật khẩu mới</b>.</p>
        <p style="font-style: italic; color: #cc0000;">Lưu ý: Liên kết này sẽ <b>hết hạn sau 15 phút</b> vì lý do bảo mật.</p>
    `,
                sub_content_html: `
        <p>Nếu bạn <b>không</b> thực hiện yêu cầu này, bạn có thể bỏ qua email này. Mật khẩu hiện tại của bạn sẽ vẫn an toàn.</p>
        <p>Nếu bạn gặp bất kỳ vấn đề gì, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.</p>
    `,
                cta_text: "Đặt lại Mật khẩu",
                url: resetPasswordLink,
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

    public refreshToken = async (userId: string, token: string) => {
        const tokenInRedis = await redisClient.get(`refreshToken:${userId}`);

        if (!tokenInRedis || tokenInRedis !== token) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Refresh token không được tìm thấy trong hệ thống hoặc không chính xác!",
            });
        }
        return await this.signAccesAndRefreshToken(userId);
    };
    public changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
        const user = await userRespository.findById(userId);
        const isMatchPassword = user && (await AlgoCrypoto.verifyPassword(oldPassword, user.password));
        if (!isMatchPassword) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.FORBIDDEN,
                message: "Mật khẩu cũ không chính xác!",
            });
        }
        const isPwdExisted = await pwsHisRepository.checkExisted(userId, newPassword);
        if (isPwdExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Mật khẩu này đã tồn tại trong quá khứ. Hãy đặt mật khẩu khác an toàn hơn!",
            });
        }
        const passwordHash = await AlgoCrypoto.hashPassword(newPassword);
        await userRespository.changePassword(userId, passwordHash);
    };
    public verifyEmail = async (token: string) => {
        try {
            const payload = await AlgoJwt.verifyToken({ token });
            if (payload.type !== TokenType.EmailVerifyToken) {
                throw new ErrorWithStatus({
                    status: HTTP_STATUS.UNAUTHORIZED,
                    message: "Token không chính xác!",
                });
            }
            return await userRespository.verifyEmail(payload.userId, token);
        } catch {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: "Token không thể xác minh!",
            });
        }
    };

    public getOneUser = async (userId: string) => {
        const user = await userRespository.findById(userId);
        if (!user) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "User không tồn tại!",
            });
        }
        // Có thể loại bỏ các trường nhạy cảm nếu cần
        return user;
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
        // Lấy role từ DB
        return (async () => {
            const user = await userRespository.findById(userId);
            const role = user?.role || "USER";
            return AlgoJwt.signToken({
                payload: { type, userId, role },
                options: { expiresIn: expiresIn * 1000 }, // convert seconds to mili seconds
            }) as Promise<string>;
        })();
    };

    private signAccesAndRefreshToken = async (userId: string) => {
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken({
                userId,
                type: TokenType.AccessToken,
            }),
            this.signToken({
                userId,
                type: TokenType.RefreshToken,
                expiresIn: ExpiresInTokenType.RefreshToken,
            }),
        ]);

        // Lưu lại refresh token vào redis
        await redisClient.set(`refreshToken:${userId}`, refreshToken, ExpiresInTokenType.RefreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    };
}
const authService = new AuthService();
export default authService;
