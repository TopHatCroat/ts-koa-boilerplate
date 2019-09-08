import { RouterContext } from "koa-router";

export default function errorHandler() {
    return async (ctx: RouterContext, next: any) => {
        try {
            await next();
        } catch (err) {
            if (err.name === "ValidationError") {
                ctx.status = 429;
            } else if (err.name === "AppError")  {
                ctx.status = err.code || 500;
            } else {
                ctx.status = 500;
            }
            ctx.body = {
                message: err.message,
            };
        }
    };
}
