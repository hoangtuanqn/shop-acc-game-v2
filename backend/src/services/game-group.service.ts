import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import gameGroupRepository from "~/repositories/game-group.repository";
import { CreateGameGroupRequestBody } from "~/models/requests/game-group.request";
import { EditGameGroupRequestBody } from "~/models/requests/game-group.request";
import Helpers from "~/utils/helpers";
import { log } from "console";

class GameGroupService {
    public create = async (data: CreateGameGroupRequestBody) => {
        const { categoryId, title, thumbnail, active } = data;

        const gameGroupExisted = await gameGroupRepository.findByCategoryId(categoryId);
        if (!gameGroupExisted) {
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
}

const gameGroupService = new GameGroupService();

export default gameGroupService;
