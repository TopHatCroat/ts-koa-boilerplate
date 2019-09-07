import {RouterContext} from "koa-router";

export default function defaultErrorHandler() {
    return async (ctx: RouterContext, next: any) => {
        try {
            await next();
        } catch (err) {
            if(err.name === "ValidationError") {
                ctx.status = 429;
            } else {
                ctx.status = err.code || 500;
            }
            ctx.body = {
                message: err.message,
            };
        }
    };
}
