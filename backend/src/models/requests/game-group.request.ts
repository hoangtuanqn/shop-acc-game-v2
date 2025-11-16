import z from "zod/v3";
import { gameGroupSchema } from "~/models/schema/game-group.schema";

export type CreateGameGroupRequestBody = z.infer<typeof gameGroupSchema>["body"];

