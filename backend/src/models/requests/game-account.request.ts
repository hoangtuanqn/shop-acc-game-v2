import z from "zod/v3";
import { gameAccountSchema } from "~/models/rules/game-account.rules";


export type CreateGameAccountRequestBody = z.infer<typeof gameAccountSchema>["body"];