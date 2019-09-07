import { RouterContext } from "koa-router";
import AppErrors from "./appErrors";

export function respondWithError(ctx: RouterContext, e: AppErrors) {
    ctx.status = e.code;
    ctx.body = {
        message: e.message,
    }
}
