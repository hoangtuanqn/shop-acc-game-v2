import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
import servicePackageService from "~/services/service-package.service";
import {
    CreateServicePackageRequestBody,
    EditServicePackageRequestBody,
} from "~/models/requests/service-package.request";

export const createServicePackage = async (
    req: Request<any, any, CreateServicePackageRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const gameServiceId = req.params.gameServiceId;
        const result = await servicePackageService.create(gameServiceId, req.body);

        return res.status(HTTP_STATUS.CREATED).json({
            message: "Tạo gói dịch vụ thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const editServicePackage = async (
    req: Request<any, any, EditServicePackageRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const packageId = req.params.id;
        const result = await servicePackageService.edit(packageId, req.body);

        return res.status(HTTP_STATUS.OK).json({
            message: "Cập nhật gói dịch vụ thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteServicePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await servicePackageService.delete(req.params.id);

        return res.status(HTTP_STATUS.OK).json({
            message: "Xóa gói dịch vụ thành công!",
        });
    } catch (error) {
        return next(error);
    }
};

export const getPackagesByService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameServiceId = req.params.gameServiceId;
        const result = await servicePackageService.getByGameServiceId(gameServiceId);

        return res.status(HTTP_STATUS.OK).json({
            message: "Lấy danh sách gói dịch vụ thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
