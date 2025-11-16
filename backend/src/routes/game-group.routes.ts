import { Router } from "express";
import * as gameGroupController from "~/controllers/game-group.controllers";
import { gameGroupSchema } from "~/models/schema/game-group.schema";
import { validate } from "~/utils/validation";

const gameGroupRouter = Router();

gameGroupRouter.post("/", validate(gameGroupSchema), gameGroupController.createGameGroup);

export default gameGroupRouter;
