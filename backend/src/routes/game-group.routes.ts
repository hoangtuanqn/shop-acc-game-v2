import { Router } from "express";
import * as gameGroupController from "~/controllers/game-group.controllers";
import { delCategoryParamsSchema, editGameGroupSchema, gameGroupSchema } from "~/models/rules/game-group.rules";
import { validate } from "~/utils/validation";

const gameGroupRouter = Router();

gameGroupRouter.post("/", validate(gameGroupSchema), gameGroupController.createGameGroup);
gameGroupRouter.put("/:id", validate(editGameGroupSchema), gameGroupController.editGameGroup);

gameGroupRouter.delete("/:id", validate(delCategoryParamsSchema), gameGroupController.deleteGameGroup);
export default gameGroupRouter;
