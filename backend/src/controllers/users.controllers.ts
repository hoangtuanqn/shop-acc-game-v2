import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import { LoginRequestBody, RegisterRequestBody } from "~/models/requests/user.request";
import userService from "~/services/user.service";
import { HTTP_STATUS } from "~/constants/httpStatus";

export const handleRegisterController = async (
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

export const handleLoginController = async (
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
