import gameCategoryRepository from "~/repositories/game-category.repository";
import { CreateGameCategoryRequestBody, EditGameCategoryRequestBody } from "~/models/requests/game-category.request";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";

class GameCategoryService {
    public create = async (data: CreateGameCategoryRequestBody) => {
        const { name, thumbnail, active } = data;

        return await gameCategoryRepository.create({ name, thumbnail, active, slug: "" });
    };

    public edit = async (id: string, data: EditGameCategoryRequestBody) => {
        const category = await gameCategoryRepository.findById(id);
        if (!category) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Danh mục không tồn tại!",
            });
        }

        return await gameCategoryRepository.edit(id, data);
    };

    public delete = async (id: string) => {
        const category = await gameCategoryRepository.findById(id);
        if (!category) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Danh mục không tồn tại!",
            });
        }

        const hasGameGroups = await gameCategoryRepository.hasGameGroups(id);
        if (hasGameGroups) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.CONFLICT,
                message: "Không thể xóa danh mục đang có group!",
            });
        }

        return await gameCategoryRepository.delete(id);
    };

    public getAll = async () => {
        const result = await gameCategoryRepository.getAll();

        return result;
    };
}

const gameCategoryService = new GameCategoryService();
export default gameCategoryService;
