import { NextFunction, Request, Response } from "express";
import { TokenType } from "~/constants/enums";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import AlgoJwt from "~/utils/jwt";

export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;
        if (!header) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: "Vui lòng đăng nhập để tiếp tục!",
            });
        }
        const token = header.split(" ")[1];
        const payload = await AlgoJwt.verifyToken({ token });
        if (payload.type !== TokenType.AccessToken) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: "Token của bạn không hợp lệ!",
            });
        }
        if (payload.role !== "ADMIN") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                message: "Bạn không có quyền truy cập tài nguyên này!",
            });
        }
        req.userId = payload.userId;
        req.role = payload.role;
        next();
    } catch (error) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn!",
        });
    }
};
