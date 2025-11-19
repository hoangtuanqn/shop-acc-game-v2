import { Router } from "express";
import { checkAdmin } from "~/middlewares/checkAdmin.middlewares";
import * as servicePackageController from "~/controllers/service-package.controllers";
import { validate } from "~/utils/validation";
import {
    createServicePackageSchema,
    editServicePackageSchema,
    deleteServicePackageSchema,
    getPackagesByServiceSchema,
} from "~/models/rules/service-package.rules";

const servicePackageRouter = Router();

servicePackageRouter.post(
    "/game-services/:gameServiceId",
    validate(createServicePackageSchema),
    servicePackageController.createServicePackage,
);

servicePackageRouter.put(
    "/packages/:id",
    validate(editServicePackageSchema),
    servicePackageController.editServicePackage,
);

servicePackageRouter.delete(
    "/packages/:id",
    validate(deleteServicePackageSchema),
    servicePackageController.deleteServicePackage,
);

servicePackageRouter.get(
    "/:gameServiceId/packages",
    validate(getPackagesByServiceSchema),
    servicePackageController.getPackagesByService,
);

export default servicePackageRouter;
