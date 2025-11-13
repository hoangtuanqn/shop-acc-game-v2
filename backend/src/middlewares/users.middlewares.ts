import { NextFunction, Request, Response } from "express";
import { checkSchema, ParamSchema } from "express-validator";
import { TokenType, UserVerifyStatus } from "~/constants/enums";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import { verifyToken } from "~/utils/jwt";
import { validate } from "~/utils/validation";
import { TokenPayload } from "~/models/requests/User.requests";
import { REGEX_USERNAME } from "~/constants/regex";
const passwordSchema: ParamSchema = {
    notEmpty: {
        errorMessage: "Please enter password.",
    },
    isStrongPassword: {
        options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        errorMessage:
            "Password must be at least 8 characters, including lowercase, uppercase, numbers and special characters.",
    },
    isString: {
        errorMessage: "Password must be characters!",
    },
    trim: true,
};
const confirmPasswordSchema: ParamSchema = {
    custom: {
        options: (value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Re-enter incorrect password!");
            }
            // return về true để pass qua
            return true;
        },
    },
};

const nameSchema: ParamSchema = {
    isLength: {
        options: {
            min: 6,
            max: 100,
        },
        errorMessage: "Full name must be between 6 and 100 characters!",
    },
    isString: {
        errorMessage: "Full name must be characters!",
    },
    trim: true,
};
const dateOfBirthSchema: ParamSchema = {
    isISO8601: {
        options: {
            strict: true,
            strictSeparator: true,
        },
        errorMessage: "Date of birth is not in ISO 8601 format!",
    },
    trim: true,
};
export const registerValidator = validate(
    checkSchema(
        {
            name: {
                ...nameSchema,
                notEmpty: {
                    errorMessage: "Please enter your first and last name.",
                },
            },
            email: {
                isEmail: {
                    errorMessage: "Please enter correct email format.",
                },
                isLength: {
                    options: {
                        min: 15,
                        max: 255,
                    },
                    errorMessage: "Email must be between 15 and 255 characters.",
                },
                trim: true,
            },
            password: passwordSchema,
            confirm_password: confirmPasswordSchema,
            date_of_birth: dateOfBirthSchema,
        },
        ["body"], // chỉ check trong body
    ),
);
export const loginValidator = validate(
    checkSchema(
        {
            email: {
                isEmail: {
                    errorMessage: "Please enter correct email format.",
                },
                trim: true,
            },
            password: {
                notEmpty: {
                    errorMessage: "Please enter password.",
                },
                isString: {
                    errorMessage: "Password must be characters!",
                },
                trim: true,
            },
        },
        ["body"],
    ),
);

export const accessTokenValidator = validate(
    checkSchema(
        {
            Authorization: {
                trim: true,
                custom: {
                    options: async (value, { req }) => {
                        const token: string = value?.split(" ")[1];
                        if (!token) {
                            throw new ErrorWithStatus({
                                message: "Access Token is required!.",
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }

                        try {
                            const decodeToken = await verifyToken({ token });
                            if (decodeToken.type !== TokenType.AccessToken) {
                                throw new Error();
                            }

                            req.decoded_authorization = decodeToken;
                        } catch (error) {
                            throw new ErrorWithStatus({
                                message: "Access Token is invalid!",
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }
                    },
                },
            },
        },
        ["headers"],
    ),
);

export const refreshTokenValidator = validate(
    checkSchema(
        {
            refresh_token: {
                trim: true,
                isJWT: true,
                custom: {
                    options: async (token, { req }) => {
                        if (!token) {
                            throw new ErrorWithStatus({
                                message: "Refresh Token is required!.",
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }
                        try {
                            const decodeToken = await verifyToken({ token });
                            if (decodeToken.type !== TokenType.RefreshToken) throw new Error();
                            req.decoded_refresh_token = decodeToken;
                        } catch (error) {
                            throw new ErrorWithStatus({
                                message: "Refresh Token is invalid!",
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }
                    },
                },
            },
        },
        ["body"],
    ),
);
export const verifyTokenValidator = validate(
    checkSchema(
        {
            verify_token: {
                trim: true,
                isJWT: true,
                custom: {
                    options: async (token, { req }) => {
                        // console.log("token >> ", token);
                        if (!token) {
                            throw new ErrorWithStatus({
                                message: "Verify Token is required!",
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }
                        try {
                            const decodeToken = await verifyToken({ token });
                            if (decodeToken.type !== TokenType.EmailVerifyToken) throw new Error();
                            req.decoded_email_verify_token = decodeToken;
                        } catch (error) {
                            throw new ErrorWithStatus({
                                message: "Verify Token is invalid!",
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }
                    },
                },
            },
        },
        ["body"],
    ),
);

export const forgotPasswordValidator = validate(
    checkSchema(
        {
            email: {
                trim: true,
                isEmail: true,
            },
        },
        ["body"],
    ),
);
export const verifyForgotPasswordTokenValidator = validate(
    checkSchema(
        {
            forgot_email_token: {
                trim: true,
                isString: true,
                isJWT: true,
                custom: {
                    options: async (token, { req }) => {
                        // console.log("token >> ", token);
                        if (!token) {
                            throw new ErrorWithStatus({
                                message: "Forgot Password Token is required!",
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }
                        try {
                            const decodeToken = await verifyToken({ token });
                            if (decodeToken.type !== TokenType.ForgotPasswordToken) throw new Error();
                            req.decoded_forgot_password_token = decodeToken;
                            return true;
                        } catch (error) {
                            throw new ErrorWithStatus({
                                message: "Forgot Pasword Token is invalid!",
                                status: HTTP_STATUS.UNAUTHORIZED,
                            });
                        }
                    },
                },
            },
        },
        ["body"],
    ),
);

export const resetPasswordValidator = validate(
    checkSchema(
        {
            password: passwordSchema,
            confirm_password: confirmPasswordSchema,
        },
        ["body"],
    ),
);

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
    const { verify } = req.decoded_authorization as TokenPayload;
    if (verify !== UserVerifyStatus.Verified) {
        return next(
            new ErrorWithStatus({
                message: "Please verify your account to continue!",
                status: HTTP_STATUS.FORBIDDEN,
            }),
        );
    }
    next();
};

export const updateMeValidator = validate(
    checkSchema({
        name: {
            ...nameSchema,
            optional: true,
            trim: true,
        },
        date_of_birth: {
            ...dateOfBirthSchema,
            optional: true,
        },
        bio: {
            optional: true,
            isString: {
                errorMessage: "Bio must be string",
            },
            isLength: {
                options: {
                    min: 1,
                    max: 255,
                },
                errorMessage: "Bio length must be from 1 to 255",
            },
            trim: true,
        },
        location: {
            optional: true,
            isString: {
                errorMessage: "Location must be string",
            },
            isLength: {
                options: {
                    min: 1,
                    max: 255,
                },
                errorMessage: "Location length must be from 1 to 255",
            },
            trim: true,
        },
        website: {
            optional: true,
            isURL: true,
            isString: {
                errorMessage: "Website must be string",
            },
            isLength: {
                options: {
                    min: 1,
                    max: 255,
                },
                errorMessage: "Website length must be from 1 to 255",
            },
            trim: true,
        },
        username: {
            optional: true,
            isString: {
                errorMessage: "Username must be string",
            },
            isLength: {
                options: {
                    min: 1,
                    max: 255,
                },
                errorMessage: "Username length must be from 1 to 255",
            },
            trim: true,
            custom: {
                options: (value: string) => {
                    if (!REGEX_USERNAME.test(value)) {
                        throw new Error("Invalid username!");
                    }
                    return true; // nhớ thêm return vô nưa
                },
            },
        },
        avatar: {
            optional: true,
            isURL: true,
            isString: {
                errorMessage: "Avatar must be string",
            },
            isLength: {
                options: {
                    min: 1,
                    max: 400,
                },
                errorMessage: "Avatar length must be from 1 to 400",
            },
            trim: true,
        },
        cover_avatar: {
            optional: true,
            isURL: true,
            isString: {
                errorMessage: "Cover Avatar must be string",
            },
            isLength: {
                options: {
                    min: 1,
                    max: 400,
                },
                errorMessage: "Cover Avatar length must be from 1 to 400",
            },
            trim: true,
        },
    }),
);
export const followValidator = validate(
    checkSchema(
        {
            followed_user_id: {
                isString: {
                    errorMessage: "Followed user id must be string",
                },
            },
        },
        ["body"],
    ),
);
export const unfollowValidator = validate(
    checkSchema(
        {
            user_id: {
                isString: {
                    errorMessage: "Followed user id must be string",
                },
            },
        },
        ["params"],
    ),
);

export const changePasswordValidator = validate(
    checkSchema(
        {
            old_password: passwordSchema,
            password: passwordSchema,
            confirm_password: confirmPasswordSchema,
        },
        ["body"],
    ),
);
// const handlerController = (req: Request, res: Response, next: NextFunction) => {
//     console.log("Log time", new Date());

//     // * next() để đi tiếp hoặc return về status failed và kèm thông báo
//     return next();

//     // return trả về status kèm nội dung
//     // return res.status(401).send({
//     //     status: false,
//     //     message: "Bạn không có quyền truy cập vô hệ thống này!",
//     // });

//     // Lưu ý: Nếu không return ở chỗ res.status(401) thì những logic dưới này vẫn chạy
//     console.log("Vẫn chạy logic");
// };
// const handlerController2 = (req: Request, res: Response, next: NextFunction) => {
//     console.log("Log time 2", new Date());
//     return next();
// };
