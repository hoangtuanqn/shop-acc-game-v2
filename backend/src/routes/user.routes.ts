import { Router } from "express";
import { handleRegisterController } from "~/controllers/users.controllers";
import User from "~/schemas/user.schema";
import prisma from "~/services/database.service";
import { hashPassword } from "~/utils/crypto";

const userRouter = Router();

// định nghĩa routing
userRouter.post("/create", handleRegisterController);
export default userRouter;
