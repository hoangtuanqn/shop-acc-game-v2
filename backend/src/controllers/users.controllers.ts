import {
    ChangePasswordRequestBody,
    FollowRequestBody,
    ForgotPasswordBody,
    LoginRequestBody,
    RefreshTokenBody,
    RegisterRequestBody,
    ResetPasswordBody,
    TokenPayload,
    UnfollowParams,
    UpdateMeRequestBody,
    VerifyEmailBody,
    VerifyForgotPasswordBody,
} from "~/models/requests/User.requests";
import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import userService from "~/services/users.service";
import { ErrorWithStatus } from "~/models/Error";
import refreshTokenService from "~/services/refreshToken.service";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ObjectId } from "mongodb";
import databaseService from "~/services/database.service";
import { pick } from "lodash";

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    const user = await userService.isAccountValidCheck(email, password);
    if (!user) {
        throw new ErrorWithStatus({ message: "Incorrect login information!", status: HTTP_STATUS.UNAUTHORIZED });
    }
    const result = await userService.login({
        userId: user._id.toString(),
        verify: user.verify,
    });
    // Save refresh token into DB || Create an index on the field 'user_id' for easier searching
    await refreshTokenService.addToken({ user_id: user._id.toString(), token: result.refreshToken });
    return res.json({
        message: "Login successfully!",
        result,
    });
};
export const registerController = async (
    req: Request<ParamsDictionary, any, RegisterRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    const { email } = req.body;
    // Add data into DB
    try {
        // throw new Error("Error ....");
        const user = await userService.getUserByEmail(email);
        if (user) {
            throw new ErrorWithStatus({
                message: "This email address already exists in the system!",
                status: HTTP_STATUS.CONFLICT,
            });
        }
        const result = await userService.register(req.body);
        const { _id, ...rs } = result;
        // Save refresh token into DB || Create an index on the field 'user_id' for easier searching
        await refreshTokenService.addToken({ user_id: _id, token: rs.refreshToken });
        return res.json({
            message: "Account registration successful!",
            result: rs,
        });
    } catch (error) {
        return next(error);
    }
};
export const refreshTokenController = async (
    req: Request<ParamsDictionary, any, RefreshTokenBody>,
    res: Response,
    next: NextFunction,
) => {
    const { refresh_token } = req.body;
    const { userId, verify } = req.decoded_refresh_token as TokenPayload;
    try {
        const user = await refreshTokenService.deleteToken(refresh_token);
        if (!user) {
            throw new ErrorWithStatus({
                message: "Token cannot be reissued!",
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }

        const result = await userService.login({ userId, verify });
        await refreshTokenService.addToken({ user_id: user._id.toString(), token: result.refreshToken });

        return res.json({
            message: "Token reissue successful!",
            result,
        });
    } catch (error) {
        next(error);
    }
};
export const logoutController = async (
    req: Request<ParamsDictionary, any, RefreshTokenBody>,
    res: Response,
    next: NextFunction,
) => {
    const { refresh_token } = req.body;
    try {
        const isExistsToken = await refreshTokenService.isExistsToken(refresh_token);
        if (!isExistsToken) {
            throw new ErrorWithStatus({
                message: "Token not exists!",
                status: HTTP_STATUS.FORBIDDEN,
            });
        }
        // Remove token out DB
        await refreshTokenService.deleteToken(refresh_token);
        return res.json({
            message: "Logout successful!",
        });
    } catch (error) {
        next(error);
    }
};

export const verifyEmailController = async (
    req: Request<ParamsDictionary, any, VerifyEmailBody>,
    res: Response,
    next: NextFunction,
) => {
    const { userId } = req.decoded_email_verify_token as TokenPayload;
    const user = await databaseService.users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "User not found!",
        });
    }
    // if (user.verify) {
    //     return res.status(HTTP_STATUS.BAD_REQUEST).json({
    //         message: "This account was previously verified!",
    //     });
    // }
    const result = await userService.verifyEmail(userId);
    if (result) {
        return res.status(HTTP_STATUS.OK).json({
            message: "Verify Email successull!",
            result,
        });
    }
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "You have already verified your account!",
    });
};

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, verify } = req.decoded_authorization as TokenPayload;
    // Kiểm tra người dùng đã verify email chưa

    const user = databaseService.users.find({ _id: new ObjectId(userId), verify: 0 });
    if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "You have already verified your account!",
        });
    }
    try {
        const result = await userService.resendVerifyEmail({ userId, verify });
        if (!result) {
            throw new ErrorWithStatus({
                message: "The confirmation email could not be resent! Please check again!",
                status: HTTP_STATUS.FORBIDDEN,
            });
        }
        return res.status(HTTP_STATUS.OK).json({
            message: "Resent the link verification account!",
        });
    } catch (error) {
        next(error);
    }
};
export const forgotPasswordController = async (
    req: Request<ParamsDictionary, any, ForgotPasswordBody>,
    res: Response,
    next: NextFunction,
) => {
    const { email } = req.body;
    try {
        const user = await databaseService.users.findOne({ email });
        if (user) {
            await userService.forgotPassword({
                userId: user._id.toString(),
                verify: user.verify,
            });
        }
        res.send({
            message: "We will send your email link address if your email exists on our system.",
        });
    } catch (error) {
        next(error);
    }
};
export const verifyForgotPasswordTokenController = async (
    req: Request<ParamsDictionary, any, VerifyForgotPasswordBody>,
    res: Response,
    next: NextFunction,
) => {
    const { forgot_email_token } = req.body;

    const { userId } = req.decoded_forgot_password_token as TokenPayload;
    try {
        const result = await databaseService.users.findOne({
            _id: new ObjectId(userId),
            forgot_email_token,
        });

        if (!result) {
            throw new ErrorWithStatus({
                message: "Forgot Password token invalid",
                status: HTTP_STATUS.UNAUTHORIZED,
            });
        }

        next();
    } catch (error) {
        next(error);
    }
    return;
};
export const resetPasswordController = async (
    req: Request<ParamsDictionary, any, ResetPasswordBody>,
    res: Response,
    next: NextFunction,
) => {
    const { password } = req.body;
    const { userId } = req.decoded_forgot_password_token as TokenPayload;
    try {
        await userService.resetPassword(userId, password);
        return res.status(HTTP_STATUS.OK).json({
            message: "Reset password successfully!",
        });
    } catch (error) {
        next(error);
    }
};
export const getInfoMeController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.decoded_authorization as TokenPayload;
    try {
        const result = await userService.getMe(userId);
        return res.status(HTTP_STATUS.OK).json({
            message: "Get info me successfully!",
            result,
        });
    } catch (error) {
        next(error);
    }
};

export const updateMeController = async (
    req: Request<ParamsDictionary, any, UpdateMeRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    const { userId } = req.decoded_authorization as TokenPayload;
    const body = pick(req.body, [
        "name",
        "day_of_birth",
        "bio",
        "location",
        "website",
        "username",
        "avatar",
        "cover_photo",
    ]);
    const result = await userService.updateMe(userId, body);
    return res.status(HTTP_STATUS.OK).json({
        message: "Update profile successfully!",
        result,
    });
};
export const getProfileController = async (req: Request<{ username: string }>, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const result = await userService.getProfile(username);
    if (!result) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.NOT_FOUND,
            message: "User not found!",
        });
    }

    res.status(HTTP_STATUS.OK).json({
        message: "Get profile successfully!",
        result,
    });
};
export const followController = async (
    req: Request<ParamsDictionary, any, FollowRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    const { userId } = req.decoded_authorization as TokenPayload;
    const { followed_user_id } = req.body;
    try {
        const result = await userService.follow(userId, followed_user_id);
        return res.status(HTTP_STATUS.OK).json({
            message: "Follow user successfully!",
            result,
        });
    } catch (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(error);
    }
};
export const unfollowController = async (req: Request<UnfollowParams>, res: Response, next: NextFunction) => {
    const { userId } = req.decoded_authorization as TokenPayload;
    const { user_id: followed_user_id } = req.params;
    try {
        const result = await userService.unfollow(userId, followed_user_id);
        return res.status(HTTP_STATUS.OK).json({
            message: "Unfollow user successfully!",
            result,
        });
    } catch (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json(error);
    }
};
export const changePasswordController = async (
    req: Request<ParamsDictionary, any, ChangePasswordRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    const { userId } = req.decoded_authorization as TokenPayload;
    const { old_password, password } = req.body;
    try {
        await userService.changePassword(userId, old_password, password);
        return res.status(HTTP_STATUS.OK).json({
            message: "Change password successfully!",
        });
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(error);
    }
};
