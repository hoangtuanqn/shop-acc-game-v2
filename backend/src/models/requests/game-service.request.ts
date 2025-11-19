import z from "zod/v3";
import { editGameServiceSchema, gameServiceSchema } from "~/models/rules/game-service.rules";

export type CreateGameServiceRequestBody = z.infer<typeof gameServiceSchema>["body"];

export type EditGameServiceRequestBody = z.infer<typeof editGameServiceSchema>["body"];
export type EditGameServiceRequestParams = z.infer<typeof editGameServiceSchema>["params"];

// export type DeleteGameServiceRequestParams = z.infer<typeof deleteGameServiceSchema>["params"];
