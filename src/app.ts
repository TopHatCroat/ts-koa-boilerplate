import Koa from "koa";
import Router from "koa-router";

import systemRouter from "./modules/system/router"
import authRouter from "./modules/auth/router"

const app = new Koa();
const router = new Router();

router.use(systemRouter.routes());
router.use(authRouter.routes());

app.use(router.routes());

export default app;
