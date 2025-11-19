import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { CreateGameServiceRequestBody } from "~/models/requests/game-service.request";
import gameServiceService from "~/services/game-service.service";

export const createGameService = async (
    req: Request<ParamsDictionary, any, CreateGameServiceRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await gameServiceService.create(req.body);
        return res.status(HTTP_STATUS.CREATED).json({
            message: "Tạo game service thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const editGameService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const serviceId = req.params.id;
        const result = await gameServiceService.edit(serviceId, req.body);

        return res.status(HTTP_STATUS.OK).json({
            message: "Cập nhật game service thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteGameService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await gameServiceService.delete(req.params.id);

        return res.status(HTTP_STATUS.OK).json({
            message: "Xóa game service thành công!",
        });
    } catch (error) {
        return next(error);
    }
};

// export const editGameService = async (
//     req: Request<EditGameCategoryRequestParams, any, EditGameCategoryRequestBody>,
//     res: Response,
//     next: NextFunction,
// ) => {
//     try {
//         const result = await gameCategoryService.edit(req.params.id, req.body);
//         return res.status(HTTP_STATUS.OK).json({
//             message: "Cập nhật danh mục game thành công!",
//             result,
//         });
//     } catch (error) {
//         return next(error);
//     }
// };

// export const deleteGameService = async (
//     req: Request<DeleteGameServiceRequestParams, any, any>,
//     res: Response,
//     next: NextFunction,
// ) => {
//     try {
//         const result = await gameCategoryService.delete(req.params.id);
//         return res.status(HTTP_STATUS.OK).json({
//             message: "Xóa danh mục thành công!",
//             result,
//         });
//     } catch (error) {
//         return next(error);
//     }
// };

// export const getAllGameServices = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const result = await gameCategoryService.getAll();
//         return res.status(HTTP_STATUS.OK).json({
//             message: "Lấy danh sách danh mục thành công",
//             result,
//         });
//     } catch (error) {
//         return next(error);
//     }
// };
