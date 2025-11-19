import { Router } from "express";
import * as gameAccountController from "~/controllers/game-account.controllers";
import { auth } from "~/middlewares/auth.middlewares";
import { checkAdmin } from "~/middlewares/checkAdmin.middlewares";
import {
    deleteGameAccountSchema,
    editGameAccountSchema,
    gameAccountSchema,
    getGameAccountsSchema,
    getOneAccountSchema,
} from "~/models/rules/game-account.rules";

import { validate } from "~/utils/validation";

const gameAccountRouter = Router();

gameAccountRouter.post(
    "/:id/account",
    checkAdmin,
    validate(gameAccountSchema),
    gameAccountController.createGameAccount,
);
gameAccountRouter.put(
    "/account-detail/:id",
    checkAdmin,
    validate(editGameAccountSchema),
    gameAccountController.editGameAccount,
);

gameAccountRouter.delete(
    "/account/:id",
    checkAdmin,
    validate(deleteGameAccountSchema),
    gameAccountController.deleteGameAccount,
);

gameAccountRouter.get("/group/:groupId", validate(getGameAccountsSchema), gameAccountController.getGameAccounts);

// mua tài khoản
gameAccountRouter.post("/:id/purchase", auth, gameAccountController.purchaseGameAccount);

gameAccountRouter.get("/my-purchased", auth, gameAccountController.getMyPurchasedAccounts);

// get one account
gameAccountRouter.get("/detail/:id", validate(getOneAccountSchema), gameAccountController.getAccountDetail);

export default gameAccountRouter;
