import z from "zod/v3";
import { deleteGameCategorySchema, editGameCategorySchema, gameCategorySchema } from "~/models/schema/game-category.schema";

export type CreateGameCategoryRequestBody = z.infer<typeof gameCategorySchema>["body"];

export type EditGameCategoryRequestBody = z.infer<typeof editGameCategorySchema>["body"];
export type EditGameCategoryRequestParams = z.infer<typeof editGameCategorySchema>["params"];

export type DeleteGameCategoryRequestParams = z.infer<typeof deleteGameCategorySchema>["params"]
