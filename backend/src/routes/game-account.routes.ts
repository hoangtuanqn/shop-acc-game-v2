import { Router } from "express";
import * as gameAccountController from "~/controllers/game-account.controllers";
import { gameAccountSchema } from "~/models/rules/game-account.rules";

import { validate } from "~/utils/validation";

const gameAccountRouter = Router();

gameAccountRouter.post("/:id/account", validate(gameAccountSchema), gameAccountController.createGameAccount);

export default gameAccountRouter;
