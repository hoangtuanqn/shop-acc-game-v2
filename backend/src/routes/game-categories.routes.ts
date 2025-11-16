import { Router } from "express";
import * as gameCategoriesController from "~/controllers/game-categories.controllers";
import { gameCategoriesSchema } from "~/models/schema/game-categories.schema";
import { validate } from "~/utils/validation";

const gameCategoriesRouter = Router();

gameCategoriesRouter.post("/", validate(gameCategoriesSchema), gameCategoriesController.createGameCategory);

export default gameCategoriesRouter;