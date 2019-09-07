import Koa from "koa";
import { parseBearerAuth } from "../token/helpers";

export default async function authenticated(ctx: Koa.BaseContext, next: () => Promise<any>) {
    const auth = ctx.headers.authorization || "";
    ctx.state.credentials = await parseBearerAuth(auth);

    await next();
}
