import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import { CreateGameAccountRequestBody } from "~/models/requests/game-account.request";
import gameAccountRepository from "~/repositories/game-account.repository";

class GameAccountService {
    public create = async (id: string, data: CreateGameAccountRequestBody) => {
        const gameGroupExisted = await gameAccountRepository.findByGroupId(id);
        if (!gameGroupExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Group này không tồn tại trong hệ thống!",
            });
        }

        return await gameAccountRepository.create(id, data);
    };
}

const gameAccountService = new GameAccountService();
export default gameAccountService;
