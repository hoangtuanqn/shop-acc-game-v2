import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import gameCategoryRepository from "~/repositories/game-category.repository";
import { CreateGameCategoryRequestBody, EditGameCategoryRequestBody } from "~/models/requests/game-category.request";
import Helpers from "~/utils/helpers";

class GameCategoryService {
    public create = async (data: CreateGameCategoryRequestBody) => {
        const { name, thumbnail, active } = data;

        return await gameCategoryRepository.create({ name, thumbnail, active, slug: "" });
    };

    public edit = async (id: string, data: EditGameCategoryRequestBody) => {
        const { name, thumbnail, active } = data;
        const slug = Helpers.generateSlug(name);

        return await gameCategoryRepository.edit(id, { name, thumbnail, active, slug });
    };

    public delete = async (id: string) => {
        return await gameCategoryRepository.delete(id);
    };
}

const gameCategoryService = new GameCategoryService();
export default gameCategoryService;
