import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import gameGroupRepository from "~/repositories/game-group.repository";
import { CreateGameGroupRequestBody } from "~/models/requests/game-group.request";
import { EditGameGroupRequestBody } from "~/models/requests/game-group.request";

class GameGroupService {
    public create = async (data: CreateGameGroupRequestBody) => {
        const { categoryId, title, thumbnail, active } = data;

        const gameCategoryExisted = await gameGroupRepository.findByCategoryId(categoryId);
        if (!gameCategoryExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Danh mục này không tồn tại trong hệ thống!",
            });
        }

        return await gameGroupRepository.create({ categoryId, title, thumbnail, active, slug: "" });
    };

    public edit = async (id: string, data: EditGameGroupRequestBody) => {
        const { categoryId } = data;

        const categoryExisted = await gameGroupRepository.findByCategoryId(categoryId);
        if (!categoryExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Danh mục này không tồn tại trong hệ thống!",
            });
        }

        const gameGroupExisted = await gameGroupRepository.findById(id);
        if (!gameGroupExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Group này không tồn tại trong hệ thống!",
            });
        }

        return await gameGroupRepository.edit(id, data);
    };

    public delete = async (id: string) => {
        const gameGroupExisted = await gameGroupRepository.findById(id);
        if (!gameGroupExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Group không tồn tại trong hệ thống!",
            });
        }

        return await gameGroupRepository.delete(id);
    };

    public getGameGroups = async (id: string) => {
        const categoryExisted = await gameGroupRepository.findByCategoryId(id);
        if (!categoryExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Danh mục này không tồn tại trong hệ thống!",
            });
        }

        const result = await gameGroupRepository.getGameGroups(id);

        return result;
    };
}

const gameGroupService = new GameGroupService();

export default gameGroupService;
