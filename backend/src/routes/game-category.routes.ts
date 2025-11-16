import { Router } from "express";
import * as gameCategoryController from "~/controllers/game-category.controllers";
import {
    gameCategorySchema,
    editGameCategorySchema,
    deleteGameCategorySchema,
} from "~/models/schema/game-category.schema";
import { validate } from "~/utils/validation";

const gameCategoryRouter = Router();

gameCategoryRouter.post("/", validate(gameCategorySchema), gameCategoryController.createGameCategory);
gameCategoryRouter.put("/:id", validate(editGameCategorySchema), gameCategoryController.editGameCategory);

gameCategoryRouter.delete("/:id", validate(deleteGameCategorySchema), gameCategoryController.deleteGameCategory);
export default gameCategoryRouter;
