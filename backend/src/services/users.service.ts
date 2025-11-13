import User from "~/schemas/User.schema";
import databaseService from "./database.service";
import { RegisterRequestBody, UpdateMeRequestBody } from "~/models/requests/User.requests";
import { hashPassword, verifyPassword } from "~/utils/crypto";
import { signToken } from "~/utils/jwt";
import { TokenType, UserVerifyStatus } from "~/constants/enums";
import { ObjectId } from "mongodb";
import RefreshToken from "~/schemas/RefreshToken.schema";
import Follower from "~/schemas/Follower.schema";
import { ErrorWithStatus } from "~/models/Error";
import { HTTP_STATUS } from "~/constants/httpStatus";

class UserService {
    register = async (payload: RegisterRequestBody) => {
        const userId = new ObjectId();
        const dataSignToken: { userId: string; verify: UserVerifyStatus } = {
            userId: userId.toString(),
            verify: UserVerifyStatus.Unverifyed,
        };
        const tokenVerifyEmail = await this.signVerifyToken(dataSignToken);
        await databaseService.users.insertOne(
            new User({
                ...payload,
                _id: userId,
                date_of_birth: new Date(payload.date_of_birth),
                email_verify_token: tokenVerifyEmail,
                password: await hashPassword(payload.password),
            }),
        );
        // console.log("tokenVerifyEmail", tokenVerifyEmail);

        // const userId = result.insertedId.toString();
        const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(dataSignToken);
        return {
            _id: userId.toString(),
            accessToken,
            refreshToken,
        };
    };

    login = async ({ userId, verify }: { userId: string; verify: UserVerifyStatus }) => {
        const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({ userId, verify });
        return {
            accessToken,
            refreshToken,
        };
    };

    private signAccessToken = ({ userId, verify }: { userId: string; verify: UserVerifyStatus }) => {
        return signToken({
            payload: {
                type: TokenType.AccessToken,
                userId,
                verify,
            },
            options: {
                expiresIn: "15m",
            },
        }) as Promise<string>;
    };
    private signForgorPasswordToken = ({ userId, verify }: { userId: string; verify: UserVerifyStatus }) => {
        return signToken({
            payload: {
                type: TokenType.ForgotPasswordToken,
                userId,
                verify,
            },
            options: {
                expiresIn: "30m",
            },
        }) as Promise<string>;
    };
    private signRefreshToken = ({ userId, verify }: { userId: string; verify: UserVerifyStatus }) => {
        return signToken({
            payload: {
                type: TokenType.RefreshToken,
                userId,
                verify,
            },
            options: {
                expiresIn: "100d",
            },
        }) as Promise<string>;
    };

    private signVerifyToken = ({ userId, verify }: { userId: string; verify: UserVerifyStatus }) => {
        return signToken({
            payload: {
                type: TokenType.EmailVerifyToken,
                userId,
                verify,
            },
            options: {
                expiresIn: "3d",
            },
        }) as Promise<string>;
    };

    private signAccessAndRefreshToken = ({ userId, verify }: { userId: string; verify: UserVerifyStatus }) => {
        return Promise.all([this.signAccessToken({ userId, verify }), this.signRefreshToken({ userId, verify })]);
    };

    getUserByEmail = async (email: string) => {
        const result = await databaseService.users.findOne({ email });
        return result;
    };

    isAccountValidCheck = async (email: string, password: string) => {
        const user = await this.getUserByEmail(email);
        // Check password
        const isValid = await verifyPassword(password, user?.password ?? "");
        return isValid ? user : null;
    };

    verifyEmail = async (userId: string) => {
        const [token] = await Promise.all([
            this.signAccessAndRefreshToken({ userId, verify: UserVerifyStatus.Verified }),
            databaseService.users.findOneAndUpdate(
                { _id: new ObjectId(userId), verify: UserVerifyStatus.Unverifyed },
                {
                    $set: {
                        email_verify_token: "",
                        verify: UserVerifyStatus.Verified,
                    },
                    $currentDate: {
                        updated_at: true,
                    },
                },
            ),
        ]);
        const [access_token, refresh_token] = token;

        await databaseService.refreshToken.insertOne(
            new RefreshToken({ user_id: new ObjectId(userId), token: refresh_token }),
        );
        return {
            access_token,
            refresh_token,
        };
    };

    resendVerifyEmail = async ({ userId, verify }: { userId: string; verify: UserVerifyStatus }) => {
        const tokenVerifyEmail = await this.signVerifyToken({ userId, verify });

        const result = await databaseService.users.updateOne(
            {
                _id: new ObjectId(userId),
                verify: UserVerifyStatus.Unverifyed,
            },
            {
                $set: {
                    email_verify_token: tokenVerifyEmail,
                },
                $currentDate: {
                    updated_at: true,
                },
            },
        );
        return result;
    };

    forgotPassword = async ({ userId, verify }: { userId: string; verify: UserVerifyStatus }) => {
        const forgot_email_token = await this.signForgorPasswordToken({ userId, verify });
        // Cập nhật lại thông tin
        const result = await databaseService.users.findOneAndUpdate(
            {
                _id: new ObjectId(userId),
            },
            {
                $set: {
                    forgot_email_token,
                },
                $currentDate: {
                    updated_at: true,
                },
            },
        );
        return result;
    };

    resetPassword = async (userId: string, password: string) => {
        const result = databaseService.users.findOneAndUpdate(
            {
                _id: new ObjectId(userId),
            },
            {
                $set: {
                    forgot_email_token: "",
                    password: await hashPassword(password),
                },
                $currentDate: {
                    updated_at: true,
                },
            },
        );
        return result;
    };

    getMe = async (userId: string) => {
        const result = databaseService.users.findOne(
            { _id: new ObjectId(userId) },
            {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_email_token: 0,
                },
            },
        );
        return result;
    };
    updateMe = async (userId: string, payload: UpdateMeRequestBody) => {
        // Check username này có tồn tại trong DB chưa
        const usernameExists = await databaseService.users.findOne({
            _id: {
                $ne: new ObjectId(userId),
            },
            username: payload.username,
        });
        if (usernameExists) {
            throw new ErrorWithStatus({
                message: "This username is already in use!",
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }

        const result = await databaseService.users.findOneAndUpdate(
            {
                _id: new ObjectId(userId),
            },
            {
                $set: {
                    ...(payload as UpdateMeRequestBody & { date_of_birth?: Date }),
                },
                $currentDate: {
                    updated_at: true,
                },
            },

            {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_email_token: 0,
                },
                returnDocument: "after",
            },
        );
        return result;
    };

    getProfile = async (username: string) => {
        const user = await databaseService.users.findOne(
            {
                username,
            },
            {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_email_token: 0,
                    verify: 0,
                    created_at: 0,
                    updated_at: 0,
                },
            },
        );
        return user;
    };

    follow = async (user_id: string, followed_user_id: string) => {
        if (!ObjectId.isValid(followed_user_id)) {
            throw new ErrorWithStatus({
                message: "User not found!",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }
        if (user_id === followed_user_id) {
            throw new ErrorWithStatus({
                message: "You can not follow yourself.",
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }
        // Check xem người này đã follow người đó từ trước chưa

        const data = {
            user_id: new ObjectId(user_id),
            followed_user_id: new ObjectId(followed_user_id),
        };

        const isExists = await databaseService.followers.findOne(data);
        if (isExists) {
            throw new ErrorWithStatus({
                message: "You have followed this person before!",
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }
        const follower = await databaseService.followers.insertOne(new Follower(data));
        return follower;
    };
    unfollow = async (user_id: string, followed_user_id: string) => {
        if (!ObjectId.isValid(followed_user_id)) {
            throw new ErrorWithStatus({
                message: "User not found!",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }
        const data = {
            user_id: new ObjectId(user_id),
            followed_user_id: new ObjectId(followed_user_id),
        };

        const isExists = await databaseService.followers.findOne(data);
        if (!isExists) {
            throw new ErrorWithStatus({
                message: "You have not followed this user!",
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }
        const follower = await databaseService.followers.deleteOne(data);
        return follower;
    };

    changePassword = async (user_id: string, old_password: string, new_password: string) => {
        // Kiểm tra password của người dùng hiện tại
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
        const isCheck = await verifyPassword(old_password, user?.password as string);
        if (!isCheck) {
            throw new ErrorWithStatus({
                message: "Old password is incorrect",
                status: HTTP_STATUS.UNAUTHORIZED,
            });
        }

        const update = await databaseService.users.updateOne(
            {
                _id: new ObjectId(user_id),
            },
            {
                $set: {
                    password: await hashPassword(new_password),
                },
                $currentDate: {
                    updated_at: true,
                },
            },
        );
        return update;
    };
}
const userService = new UserService();
export default userService;
