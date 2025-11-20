import { Router } from "express";
import * as gameGroupController from "~/controllers/game-group.controllers";
import { checkAdmin } from "~/middlewares/checkAdmin.middlewares";
import {
    delCategoryParamsSchema,
    editGameGroupSchema,
    gameGroupSchema,
    getGameGroupsByCategorySchema,
} from "~/models/rules/game-group.rules";
import { validate } from "~/utils/validation";

const gameGroupRouter = Router();

// Admin: Lấy tất cả group của 1 category (không lọc active, có phân trang)
gameGroupRouter.get(
    "/admin/category/:categoryId",

    gameGroupController.getAllGameGroupsAdmin,
);

gameGroupRouter.post("/", validate(gameGroupSchema), gameGroupController.createGameGroup);
gameGroupRouter.put("/:id", validate(editGameGroupSchema), gameGroupController.editGameGroup);

gameGroupRouter.delete("/:id", validate(delCategoryParamsSchema), gameGroupController.deleteGameGroup);

//view - lấy groups theo categoryId
gameGroupRouter.get(
    "/category/:categoryId",
    validate(getGameGroupsByCategorySchema),
    gameGroupController.getGameGroups,
);

export default gameGroupRouter;
