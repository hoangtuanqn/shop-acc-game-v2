import { Router } from "express";
import { TokenType } from "~/constants/enums";
import * as authController from "~/controllers/users.controllers";
import * as authMiddleware from "~/middlewares/auth.middlewares";
import {
    changePasswordSchema,
    forgotPasswordSchema,
    loginSchema,
    refreshTokenSchema,
    registerSchema,
    resetPasswordParamsSchema,
    resetPasswordSchema,
    verifyEmailParamsSchema,
} from "~/models/auth/auth.schema";
import { validate } from "~/utils/validation";

const authRouter = Router();

// định nghĩa routing
authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
authRouter.get("/verify-email/:token", validate(verifyEmailParamsSchema), authController.verifyEmail);
authRouter.post(
    "/refresh-token",
    validate(refreshTokenSchema),
    authMiddleware.verifyToken(TokenType.RefreshToken, "body"),
    authController.refreshToken,
);
authRouter.get(
    "/reset-password/:token",
    validate(resetPasswordParamsSchema),
    authMiddleware.verifyToken(TokenType.ForgotPasswordToken),
    authController.verifyResetPasswordToken,
);
authRouter.post(
    "/reset-password/:token",
    validate(resetPasswordSchema),
    authMiddleware.verifyToken(TokenType.ForgotPasswordToken),
    authController.resetPassword,
);
// Thay đổi mk (lúc người dùng đang đăng nhập)
authRouter.post("/change-password", authMiddleware.auth, validate(changePasswordSchema), authController.changePassword);
export default authRouter;
