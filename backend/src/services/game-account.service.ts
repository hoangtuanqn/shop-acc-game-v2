import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import { CreateGameAccountRequestBody, EditGameAccountRequestBody } from "~/models/requests/game-account.request";
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

        if (data.price !== undefined && data.price <= 0) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Giá phải lớn hơn 0!",
            });
        }

        return await gameAccountRepository.create(id, data);
    };

    public edit = async (id: string, data: EditGameAccountRequestBody) => {
        const accountExisted = await gameAccountRepository.findByAccountId(id);
        if (!accountExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Account này không tồn tại trong hệ thống!",
            });
        }

        if (data.price !== undefined && data.price <= 0) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Giá phải lớn hơn 0!",
            });
        }

        return await gameAccountRepository.edit(id, data);
    };

    public delete = async (id: string) => {
        const gameAccountExisted = await gameAccountRepository.findByAccountId(id);
        if (!gameAccountExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Tài khoản không tồn tại trong hệ thống!",
            });
        }

        if (gameAccountExisted.status === 1) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: "Không thể xóa account đã bán!",
            });
        }

        return await gameAccountRepository.delete(id);
    };
}

const gameAccountService = new GameAccountService();
export default gameAccountService;
