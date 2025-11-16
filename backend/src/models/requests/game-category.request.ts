import z from "zod/v3";
import { gameCategorySchema } from "../schema/game-category.schema";

export type CreateGameCategoryRequestBody = z.infer<typeof gameCategorySchema>["body"];
