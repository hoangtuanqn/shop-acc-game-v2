import { NextFunction, Request, Response } from "express";
import { pick } from "lodash";
// dùng để lọc các field dư thừa được gửi lên
export const filterMiddleware =
    <T>(filters: Array<keyof T>) =>
    (req: Request, res: Response, next: NextFunction) => {
        req.body = pick(req.body, filters);
        next();
    };
