import z from "zod/v3";
import { gameGroupSchema, editGameGroupSchema, delCategoryParamsSchema } from "~/models/rules/game-group.rules";

export type CreateGameGroupRequestBody = z.infer<typeof gameGroupSchema>["body"];

export type EditGameGroupRequestBody = z.infer<typeof editGameGroupSchema>["body"];
export type EditGameGroupRequestParams = z.infer<typeof editGameGroupSchema>["params"];

export type DeleteGameGroupRequestParams = z.infer<typeof delCategoryParamsSchema>["params"];

