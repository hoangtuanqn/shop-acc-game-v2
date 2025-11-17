import z from "zod/v3";
import { deleteGameAccountSchema, editGameAccountSchema, gameAccountSchema } from "~/models/rules/game-account.rules";

export type CreateGameAccountRequestBody = z.infer<typeof gameAccountSchema>["body"];

export type EditGameAccountRequestBody = z.infer<typeof editGameAccountSchema>["body"];

export type DelGameAccountRequestParams = z.infer<typeof deleteGameAccountSchema>["params"];
