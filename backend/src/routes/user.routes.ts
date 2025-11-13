import { changePasswordValidator, unfollowValidator } from "./../middlewares/users.middlewares";
import { Router } from "express";

import {
    changePasswordController,
    followController,
    forgotPasswordController,
    getInfoMeController,
    getProfileController,
    loginController,
    logoutController,
    refreshTokenController,
    registerController,
    resendVerifyEmailController,
    resetPasswordController,
    unfollowController,
    updateMeController,
    verifyEmailController,
    verifyForgotPasswordTokenController,
} from "~/controllers/users.controllers";
import { filterMiddleware } from "~/middlewares/common.middleware";
import {
    accessTokenValidator,
    followValidator,
    forgotPasswordValidator,
    loginValidator,
    refreshTokenValidator,
    registerValidator,
    resetPasswordValidator,
    updateMeValidator,
    verifiedUserValidator,
    verifyForgotPasswordTokenValidator,
    verifyTokenValidator,
} from "~/middlewares/users.middlewares";
import { UpdateMeRequestBody } from "~/models/requests/User.requests";
import { wrapRequestHandler } from "~/utils/handlers";
const userRouter = Router();

// Có thể sử dụng midđleware và Có thể có nhiều middleware cùng 1 lúc
// userRouter.use(handlerController, handlerController2);

// định nghĩa routing
userRouter.post("/login", loginValidator, wrapRequestHandler(loginController));
userRouter.post("/register", registerValidator, wrapRequestHandler(registerController));
userRouter.post("/refresh-token", refreshTokenValidator, wrapRequestHandler(refreshTokenController));
userRouter.post("/logout", accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController));
userRouter.post("/verify-email", verifyTokenValidator, wrapRequestHandler(verifyEmailController));
userRouter.post("/resend-verify-email", accessTokenValidator, wrapRequestHandler(resendVerifyEmailController));
userRouter.post("/forgot-password", forgotPasswordValidator, wrapRequestHandler(forgotPasswordController));
userRouter.post(
    "/verify-forgot-password-token",
    verifyForgotPasswordTokenValidator,
    wrapRequestHandler(verifyForgotPasswordTokenController),
);
userRouter.post(
    "/reset-password",
    verifyForgotPasswordTokenValidator,
    wrapRequestHandler(verifyForgotPasswordTokenController),
    resetPasswordValidator,
    wrapRequestHandler(resetPasswordController),
);
userRouter.get("/me", accessTokenValidator, wrapRequestHandler(getInfoMeController));
userRouter.patch(
    "/me",
    accessTokenValidator,
    verifiedUserValidator,
    updateMeValidator,
    filterMiddleware<UpdateMeRequestBody>([
        "name",
        "date_of_birth",
        "bio",
        "location",
        "website",
        "username",
        "avatar",
        "cover_photo",
    ]),
    wrapRequestHandler(updateMeController),
);
userRouter.get("/:username", wrapRequestHandler(getProfileController));
userRouter.post(
    "/follow",
    accessTokenValidator,
    followValidator,
    verifiedUserValidator,
    wrapRequestHandler(followController),
);
userRouter.delete(
    "/follow/:user_id",
    accessTokenValidator,
    unfollowValidator,
    verifiedUserValidator,
    wrapRequestHandler(unfollowController),
);
userRouter.put(
    "/change-password",
    accessTokenValidator,
    changePasswordValidator,
    wrapRequestHandler(changePasswordController),
);
export default userRouter;
