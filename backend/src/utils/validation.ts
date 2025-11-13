import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { RunnableValidationChains } from "express-validator/lib/middlewares/schema";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { EntityError, ErrorWithStatus } from "~/models/Error";

export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // hàm này nó sẽ thêm những cái error validation vô req, rồi từ đó mình lấy trong req ra sử dụng
        await validations.run(req);
        const result = validationResult(req);
        if (result.isEmpty()) {
            return next();
        }
        const entityError = new EntityError({ errors: {} });
        const errors = result.mapped();
        Object.keys(errors).map((errorKey) => {
            const { msg } = errors[errorKey];
            if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
                return next(msg);
            }
            // nếu status == HTTP_STATUS.UNPROCESSABLE_ENTITY sẽ rơi xuống này
            entityError.errors[errorKey] = errors[errorKey];
        });
        return next(entityError);
    };
};
