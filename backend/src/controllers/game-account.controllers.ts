import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";

import { HTTP_STATUS } from "~/constants/httpStatus";
import gameAccountService from "~/services/game-account.service";
import { CreateGameAccountRequestBody } from "~/models/requests/game-account.request";

export const createGameAccount = async (
    req: Request<ParamsDictionary, any, CreateGameAccountRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const groupId = req.params.id; // Lấy groupId từ params
        const result = await gameAccountService.create(groupId, req.body);
        return res.status(HTTP_STATUS.CREATED).json({
            message: "Thêm account thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};