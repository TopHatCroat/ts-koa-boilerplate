import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";

import systemRouter from "./modules/system/router"
import authRouter from "./modules/auth/router"
import bookingRouter from "./modules/booking/router"

const app = new Koa();
const router = new Router();

router.use(bodyParser());

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            message: err.message
        };
    }
});

router.use(systemRouter.routes());
router.use(authRouter.routes());
router.use(bookingRouter.routes());

app.use(router.routes());

export default app;
