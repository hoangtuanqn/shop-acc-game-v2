import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import gameCategoryRepository from "~/repositories/game-category.repository";

import { CreateGameCategoryRequestBody } from "~/models/requests/game-category.request";

class GameCategoryService {
    public create = async (data: CreateGameCategoryRequestBody) => {
        const { name, thumbnail, slug = "", active } = data;

        return await gameCategoryRepository.create({ name, thumbnail, active, slug });
    };
}

const gameCategoryService = new GameCategoryService();
export default gameCategoryService;
