import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import {
    CreateGameCategoryRequestBody,
    DeleteGameCategoryRequestParams,
    EditGameCategoryRequestBody,
    EditGameCategoryRequestParams,
} from "~/models/requests/game-category.request";
import gameCategoryService from "~/services/game-category.service";
import { HTTP_STATUS } from "~/constants/httpStatus";

export const createGameCategory = async (
    req: Request<ParamsDictionary, any, CreateGameCategoryRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await gameCategoryService.create(req.body);
        return res.status(HTTP_STATUS.CREATED).json({
            message: "Tạo danh mục game thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const editGameCategory = async (
    req: Request<EditGameCategoryRequestParams, any, EditGameCategoryRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await gameCategoryService.edit(req.params.id, req.body);
        return res.status(HTTP_STATUS.OK).json({
            message: "Cập nhật danh mục game thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteGameCategory = async (
    req: Request<DeleteGameCategoryRequestParams, any, any>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await gameCategoryService.delete(req.params.id);
        return res.status(HTTP_STATUS.OK).json({
            message: "Xóa danh mục thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllGameCategorys = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await gameCategoryService.getAll();
        return res.status(HTTP_STATUS.OK).json({
            message: "Lấy danh sách danh mục thành công",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
