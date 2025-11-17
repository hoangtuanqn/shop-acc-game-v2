import z from "zod/v3";
import { editGameAccountSchema, gameAccountSchema } from "~/models/rules/game-account.rules";


export type CreateGameAccountRequestBody = z.infer<typeof gameAccountSchema>["body"];

export type EditGameAccountRequestBody = z.infer<typeof editGameAccountSchema>['body'];