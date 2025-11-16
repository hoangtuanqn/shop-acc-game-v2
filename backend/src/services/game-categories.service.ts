import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import gameCategoriesRepository from "~/repositories/game-categories.repository";
import { nanoid } from "nanoid";

import { CreateGameCategoryRequestBody } from "~/models/requests/game-categories.resquest";

class GameCategoriesService {
    public create = async (data: CreateGameCategoryRequestBody) => {
        let { name, thumbnail, slug, active } = data;

        if (!slug) {
            const baseSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            slug = `${baseSlug}-${nanoid(5)}`;
        }

        return await gameCategoriesRepository.create({ name, thumbnail, active, slug });
    };
}

const gameCategoriesService = new GameCategoriesService();
export default gameCategoriesService;
