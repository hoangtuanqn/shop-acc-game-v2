import { Router } from "express";
import * as gameAccountController from "~/controllers/game-account.controllers";
import { deleteGameAccountSchema, editGameAccountSchema, gameAccountSchema } from "~/models/rules/game-account.rules";

import { validate } from "~/utils/validation";

const gameAccountRouter = Router();

gameAccountRouter.post("/:id/account", validate(gameAccountSchema), gameAccountController.createGameAccount);
gameAccountRouter.put("/account-detail/:id", validate(editGameAccountSchema), gameAccountController.editGameAccount);

gameAccountRouter.delete("/account/:id", validate(deleteGameAccountSchema), gameAccountController.deleteGameAccount);

export default gameAccountRouter;
