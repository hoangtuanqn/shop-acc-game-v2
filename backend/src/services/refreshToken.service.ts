import { ObjectId } from "mongodb";
import databaseService from "./database.service";
import RefreshToken from "~/schemas/RefreshToken.schema";

class UserService {
    addToken = async (payload: { user_id: string; token: string }) => {
        const { user_id, token } = payload;
        /*
            Thêm record mới (nếu người dùng login trên nhiều thiết bị thì vẫn được)
        */
        const result = await databaseService.refreshToken.insertOne(
            new RefreshToken({
                user_id: new ObjectId(user_id),
                token,
            }),
        );
        return result;
    };
    deleteToken = async (token: string) => {
        const result = await databaseService.refreshToken.findOneAndDelete({
            token,
        });
        return result;
    };

    isExistsToken = async (token: string) => {
        const result = await databaseService.refreshToken.findOne({
            token,
        });
        return result;
    };
}
const refreshTokenService = new UserService();
export default refreshTokenService;
