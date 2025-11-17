import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";

import { HTTP_STATUS } from "~/constants/httpStatus";
import gameAccountService from "~/services/game-account.service";
import {
    CreateGameAccountRequestBody,
    DelGameAccountRequestParams,
    EditGameAccountRequestBody,
} from "~/models/requests/game-account.request";

export const createGameAccount = async (
    req: Request<ParamsDictionary, any, CreateGameAccountRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const groupId = req.params.id; // Lấy groupId từ params
        const result = await gameAccountService.create(groupId, req.body);

        // Convert BigInt sang string để có thể serialize JSON
        const resultWithStringPrice = {
            ...result,
            price: result.price.toString(),
        };

        return res.status(HTTP_STATUS.CREATED).json({
            message: "Thêm account thành công!",
            result: resultWithStringPrice,
        });
    } catch (error) {
        return next(error);
    }
};

export const editGameAccount = async (
    req: Request<ParamsDictionary, any, EditGameAccountRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const accountId = req.params.id;
        const result = await gameAccountService.edit(accountId, req.body);

        // Convert BigInt sang string
        const resultWithStringPrice = {
            ...result,
            price: result.price.toString(),
        };

        return res.status(HTTP_STATUS.OK).json({
            message: "Cập nhật account thành công!",
            result: resultWithStringPrice,
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteGameAccount = async (
    req: Request<DelGameAccountRequestParams, any, any>,
    res: Response,
    next: NextFunction,
) => {
    try {
        await gameAccountService.delete(req.params.id);
        return res.status(HTTP_STATUS.OK).json({
            message: "Xóa account thành công!",
        });
    } catch (error) {
        return next(error);
    }
};
