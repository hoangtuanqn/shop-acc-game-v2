import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routes/user.routes";
import "dotenv/config"; // thêm cái này để có thể sử dụng biến môi trường (nếu k sẽ là underfined), import ở file này thì tất cả file con đều được áp dụng
import { defaultErrorHandler } from "./middlewares/error.middlewares";
import { defaultSuccessHandler } from "./middlewares/success.middlewares";
import authRouter from "./routes/auth.routes";
import redisClient from "./configs/redis";
import { limiterMiddleware } from "./middlewares/common.middleware";
const app = express();
const PORT = process.env.PORT || 8000;
// parse body request
app.use(express.json()); // hoặc dùng app.use(bodyParser.json());, nhưng phải npm i bodyParser về nữa
app.use(limiterMiddleware);
redisClient.connect();
// sau khi đã định nghĩa routing với biến "router" thì phải sử dụng app.use( .... ) để chạy các routing đã cài trong "router"
app.use("/auth", authRouter);
app.use("/users", userRouter);
// handler xử lý lỗi cho cả hệ thống
app.use(defaultErrorHandler);
app.use(defaultSuccessHandler);

app.listen(PORT, () => {
    console.log(`Server successfully launched on PORT ${PORT}!`);
});
