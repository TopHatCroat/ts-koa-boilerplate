import { RouterContext } from "koa-router";
import { AppError } from "./appError";

export function respondWithError(ctx: RouterContext, e: AppError) {
    ctx.status = e.code;
    ctx.body = {
        message: e.message,
    };
}
