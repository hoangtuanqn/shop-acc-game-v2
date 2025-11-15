import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import {
    ForgotPasswordRequestBody,
    LoginRequestBody,
    RegisterRequestBody,
    ResetPasswordRequestBody,
    ResetPasswordRequestParams,
} from "~/models/requests/user.request";
import userService from "~/services/user.service";
import { HTTP_STATUS } from "~/constants/httpStatus";

export const register = async (
    req: Request<ParamsDictionary, any, RegisterRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await userService.create(req.body);
        return res.status(HTTP_STATUS.CREATED).json({
            message: "Bạn đã đăng ký tài khoản thành công trên hệ thống!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const login = async (
    req: Request<ParamsDictionary, any, LoginRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await userService.login(req.body);
        return res.status(HTTP_STATUS.OK).json({
            message: "Bạn đã đăng nhập tài khoản thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
export const forgotPassword = async (
    req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        await userService.forgotPassword(req.body);
        return res.status(HTTP_STATUS.OK).json({
            message:
                "Một địa chỉ đặt lại mật khẩu sẽ gửi về email nếu như email này đã đăng ký tài khoản trên hệ thống!",
        });
    } catch (error) {
        return next(error);
    }
};
export const verifyResetPasswordToken = async (
    req: Request<ResetPasswordRequestParams>,
    res: Response,
    next: NextFunction,
) => {
    try {
        await userService.getLinkResetPassword(req.params);
        next();
    } catch (error) {
        return next(error);
    }
};
export const resetPassword = async (
    req: Request<ResetPasswordRequestParams, any, ResetPasswordRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        await userService.resetPassword(token, password);
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã đặt lại mật khẩu thành công!",
        });
    } catch (error) {
        return next(error);
    }
};
export const verifyEmail = async (
    req: Request<ResetPasswordRequestParams, any, ResetPasswordRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        await userService.resetPassword(token, password);
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã đặt lại mật khẩu thành công!",
        });
    } catch (error) {
        return next(error);
    }
};
export const changePassword = async (
    req: Request<ResetPasswordRequestParams, any, ResetPasswordRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        await userService.resetPassword(token, password);
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã đặt lại mật khẩu thành công!",
        });
    } catch (error) {
        return next(error);
    }
};
