import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import gameGroupRepository from "~/repositories/game-group.repository";
import { CreateGameGroupRequestBody } from "~/models/requests/game-group.request";
import Helpers from "~/utils/helpers";

class GameGroupService {
    public create = async (data: CreateGameGroupRequestBody) => {
        const { categoryId, title, thumbnail, active } = data;

        const gameGroupExisted = await gameGroupRepository.findByCategoryId(categoryId);
        if (!gameGroupExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.CONFLICT,
                message: "Danh mục này không tồn tại trong hệ thống!",
            });
        }

        return await gameGroupRepository.create({ categoryId, title, thumbnail, active, slug: "" });
    };
}

const gameGroupService = new GameGroupService();

export default gameGroupService;
