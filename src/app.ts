import Koa from "koa";
import Router from "koa-router";

import systemRouter from "./modules/system/router"

const app = new Koa();
const router = new Router();

router.use(systemRouter.routes());

app.use(router.routes());

export default app;
