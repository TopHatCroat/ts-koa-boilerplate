import * as Dotenv from "dotenv";
Dotenv.config();

import app from './app';
import { config } from "./config";
import { connectToMongo } from "./service/mongo";

connectToMongo(config.mongoLocation, config.mongoPort, config.mongoName).then(() => {
    app.listen(config.port);
    console.log(`Server running on port ${config.port}`);
});
