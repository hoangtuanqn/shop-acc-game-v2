import { createClient, RedisClientType } from "redis";
class RedisClient {
    private client: RedisClientType;
    private isConnect = false;
    constructor() {
        this.client = createClient({
            // format url: redis[s]://[[username][:password]@][host][:port][/db-number]
            url: process.env.URL_REDIS,
        });

        this.client.on("error", (error) => console.log(`[REDIS] Error connect: ${error}`));

        this.client.on("ready", () => {
            this.isConnect = true;
            console.log(`[REDIS] Ready connect`);
        });
    }
    connect = async () => {
        if (this.isConnect) return;

        try {
            await this.client.connect();
        } catch (err) {
            console.error("[REDIS] Initial connect failed:", err);
        }
    };

    getClientRedis = (): RedisClientType | null => {
        if (!this.isConnect) {
            console.warn("[Redis] Client not ready yet");
            return null;
        }
        return this.client;
    };

    set = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
        if (ttlSeconds) {
            await this.client.set(key, value, { EX: ttlSeconds });
        } else {
            await this.client.set(key, value);
        }
    };

    get = async (key: string): Promise<string | null> => {
        return await this.client.get(key);
    };

    del = async (key: string): Promise<number> => {
        return await this.client.del(key);
    };
}
const redisClient = new RedisClient();
export default redisClient;
