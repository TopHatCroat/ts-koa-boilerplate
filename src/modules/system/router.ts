import Koa from 'koa';
import Router from 'koa-router';

const router = new Router();

router.get("/system/status", context => {
    context.status = 204;
});

export default router;
