import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import gameGroupService from "~/services/game-group.service";
import {
    CreateGameGroupRequestBody,
    DeleteGameGroupRequestParams,
    EditGameGroupRequestBody,
    EditGameGroupRequestParams,
    GetGameGroupsParams,
} from "~/models/requests/game-group.request";
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

export const editGameGroup = async (
    req: Request<EditGameGroupRequestParams, any, EditGameGroupRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const result = await gameGroupService.edit(id, req.body);
        return res.status(HTTP_STATUS.OK).json({
            message: "Cập nhật group thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteGameGroup = async (
    req: Request<DeleteGameGroupRequestParams, any, any>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await gameGroupService.delete(req.params.id);
        return res.status(HTTP_STATUS.OK).json({
            message: "Xóa danh mục thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const getGameGroups = async (req: Request<GetGameGroupsParams>, res: Response, next: NextFunction) => {
    try {
        const categoryId = req.params.categoryId;
        // Parse query params từ string sang number
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const result = await gameGroupService.getGameGroups(categoryId, page, limit);
        return res.status(HTTP_STATUS.OK).json({
            message: "Lấy danh sách group thành công",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
