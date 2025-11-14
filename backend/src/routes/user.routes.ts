import { Router } from "express";
import { handleLoginController, handleRegisterController } from "~/controllers/users.controllers";
import { loginSchema, registerSchema } from "~/models/auth/auth.schema";
import { validate } from "~/utils/validation";

const userRouter = Router();

// định nghĩa routing
userRouter.post("/create", validate(registerSchema), handleRegisterController);
userRouter.post("/login", validate(loginSchema), handleLoginController);
export default userRouter;
