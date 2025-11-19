import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import { CreateGameAccountRequestBody, EditGameAccountRequestBody } from "~/models/requests/game-account.request";
import gameAccountRepository from "~/repositories/game-account.repository";
import userRespository from "~/repositories/user.repository";

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

    public edit = async (id: string, data: EditGameAccountRequestBody) => {
        const accountExisted = await gameAccountRepository.findByAccountId(id);
        if (!accountExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Account này không tồn tại trong hệ thống!",
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

    public getAccounts = async (groupId: string, page?: number, limit?: number) => {
        // 1. Kiểm tra group có tồn tại không
        const groupExists = await gameAccountRepository.findByGroupId(groupId);
        if (!groupExists) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Group không tồn tại!",
            });
        }

        return await gameAccountRepository.getAllByGroupId({ groupId, page, limit });
    };

    purchaseAccount = async (accountId: string, userId: string) => {
        const account = await gameAccountRepository.findByAccountId(accountId);
        if (!account) {
            throw new ErrorWithStatus({
                message: "Tài khoản không tồn tại",
                status: HTTP_STATUS.NOT_FOUND,
            });
        }

        if (account.status === 1 || account.buyerId) {
            throw new ErrorWithStatus({
                message: "Tài khoản đã được mua",
                status: HTTP_STATUS.BAD_REQUEST,
            });
        }

        // const user = await userRespository.findById(userId);
        // if (user.balance < account.price) {
        //     throw new ErrorWithStatus({
        //         message: "Số dư không đủ",
        //         status: HTTP_STATUS.BAD_REQUEST
        //     });
        // }

        const result = await gameAccountRepository.purchase(accountId, userId);

        // 5. Trừ tiền user (nếu có hệ thống balance)
        // await userRepository.updateBalance(userId, user.balance - account.price);

        return result;
    };

    getMyPurchasedAccounts = async (userId: string) => {
        return gameAccountRepository.getMyPurchasedAccounts(userId);
    };
}

const gameAccountService = new GameAccountService();
export default gameAccountService;
