import z from "zod/v3";

import { createOrderServiceSchema } from "~/models/rules/order-service.rules";

export type CreateOrderServiceRequestBody = z.infer<typeof createOrderServiceSchema>["body"];
