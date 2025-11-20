import { Router } from "express";
// import { checkAdmin } from "~/middlewares/checkAdmin.middlewares";
import * as gameServiceController from "~/controllers/game-service.controllers";
import { deleteGameServiceSchema, editGameServiceSchema, gameServiceSchema } from "~/models/rules/game-service.rules";
import { validate } from "~/utils/validation";

const gameServiceRouter = Router();

gameServiceRouter.post("/", validate(gameServiceSchema), gameServiceController.createGameService);
gameServiceRouter.put("/:id", validate(editGameServiceSchema), gameServiceController.editGameService);

gameServiceRouter.delete("/:id", validate(deleteGameServiceSchema), gameServiceController.deleteGameService);

//view
gameServiceRouter.get("/", gameServiceController.getAllGameServices);

export default gameServiceRouter;
