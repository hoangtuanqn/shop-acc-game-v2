// đọc document tại đây: https://github.com/mongodb/node-mongodb-native
import { Collection, Db, MongoClient } from "mongodb";
import User from "~/schemas/User.schema";
import RefreshToken from "~/schemas/RefreshToken.schema";
import Follower from "~/schemas/Follower.schema";
class DatabaseService {
    private client: MongoClient;
    private dbName: string;
    private db: Db;
    constructor() {
        this.dbName = process.env.DB_NAME || "twitter_dev";

        this.client = new MongoClient(process.env.DB_URL || "mongodb://localhost:27017");
        this.db = this.client.db(this.dbName);
    }
    // function connect với DB
    async connect() {
        try {
            await this.client.connect();
            // Use connect method to connect to the server
            // this.db = this.client.db(this.dbName);
            console.log("Connect DB successfully!");
        } catch (error) {
            console.log("Failed connect DB!", error);
            throw error;
        }
        return this.db;
    }

    // db users
    get users(): Collection<User> {
        return this.db.collection("users");
    }

    get refreshToken(): Collection<RefreshToken> {
        return this.db.collection("refresh_token");
    }

    get followers(): Collection<Follower> {
        return this.db.collection("followers");
    }
}
const databaseService = new DatabaseService();
export default databaseService;
