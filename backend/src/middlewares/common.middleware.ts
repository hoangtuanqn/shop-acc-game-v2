import rateLimit from "express-rate-limit";

export const limiterMiddleware = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 100,
});
