import z from "zod/v3";

import { gameCategoriesSchema } from "../schema/game-categories.schema";

export type CreateGameCategoryRequestBody = z.infer<typeof gameCategoriesSchema>["body"];