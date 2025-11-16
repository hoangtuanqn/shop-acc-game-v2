import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import gameGroupService from "~/services/game-group.service";
import { CreateGameGroupRequestBody } from "~/models/requests/game-group.request";
import { HTTP_STATUS } from "~/constants/httpStatus";

export const createGameGroup = async (
    req: Request<ParamsDictionary, any, CreateGameGroupRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await gameGroupService.create(req.body);
        return res.status(HTTP_STATUS.CREATED).json({
            message: "Tạo nhóm game thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
