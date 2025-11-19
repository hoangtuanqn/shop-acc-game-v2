import z from "zod/v3";
import {
    createServicePackageSchema,
    deleteServicePackageSchema,
    editServicePackageSchema,
} from "~/models/rules/service-package.rules";

export type CreateServicePackageRequestBody = z.infer<typeof createServicePackageSchema>["body"];

export type EditServicePackageRequestBody = z.infer<typeof editServicePackageSchema>["body"];
export type EditServicePackageRequestParams = z.infer<typeof editServicePackageSchema>["params"];

export type DeleteServicePackageRequestParams = z.infer<typeof deleteServicePackageSchema>["params"];
