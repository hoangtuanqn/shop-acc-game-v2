import { Router } from "express";
import * as gameCategoryController from "~/controllers/game-category.controllers";
import { gameCategorySchema } from "~/models/schema/game-category.schema";
import { validate } from "~/utils/validation";

const gameCategoryRouter = Router();

gameCategoryRouter.post("/", validate(gameCategorySchema), gameCategoryController.createGameCategory);

export default gameCategoryRouter;
