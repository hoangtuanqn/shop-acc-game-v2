import prisma from "~/configs/prisma";
import { MAX_HISTORY_PASSWORD } from "~/constants/enums";
import PasswordHistory from "~/schemas/password-history";
import AlgoCrypoto from "~/utils/crypto";

class PwsHistoryRepository {
    save = async (userId: string, password: string) => {
        const result = await prisma.passwordHistory.create({
            data: new PasswordHistory({
                userId,
                password,
            }),
        });
        return result;
    };
    checkExisted = async (userId: string, password: string) => {
        const results = await prisma.passwordHistory.findMany({
            where: { userId },
            take: MAX_HISTORY_PASSWORD,
            orderBy: { updatedAt: "desc" },
            select: { password: true },
        });
        for (const item of results) {
            const isSame = await AlgoCrypoto.verifyPassword(password, item.password);
            if (isSame) return true;
        }
        return false;
    };
}
const pwsHisRepository = new PwsHistoryRepository();
export default pwsHisRepository;
