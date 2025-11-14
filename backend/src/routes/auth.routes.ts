import { Router } from "express";
import {
    handleForgotController,
    handleGetLinkResetPasswordController,
    handleLoginController,
    handleRegisterController,
    handleResetPasswordController,
} from "~/controllers/users.controllers";
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordParamsSchema,
    resetPasswordSchema,
} from "~/models/auth/auth.schema";
import { validate } from "~/utils/validation";

const authRouter = Router();

// định nghĩa routing
authRouter.post("/register", validate(registerSchema), handleRegisterController);
authRouter.post("/login", validate(loginSchema), handleLoginController);
authRouter.post("/forgot-password", validate(forgotPasswordSchema), handleForgotController);
authRouter.get("/reset-password/:token", validate(resetPasswordParamsSchema), handleGetLinkResetPasswordController);
authRouter.post(
    "/reset-password/:token",
    validate(resetPasswordParamsSchema),
    handleGetLinkResetPasswordController,
    validate(resetPasswordSchema),
    handleResetPasswordController,
);
// authRouter.post("/change-password", validate(loginSchema), handleLoginController);
export default authRouter;
