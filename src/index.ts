import Koa from "koa";
import Router from "koa-router";

import systemRouter from "./modules/system/router"
import { config } from "./config";

const app = new Koa();
const router = new Router();

router.use(systemRouter.routes());

app.use(router.routes());

app.listen(config.port);

console.log(`Server running on port ${config.port}`);
