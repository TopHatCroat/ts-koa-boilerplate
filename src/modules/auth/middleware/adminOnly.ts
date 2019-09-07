import koa from "koa";
import { parseBearerAuth } from "../token/helpers";
import { UnauthorizedError } from "../errors";
import { ICredentials } from "../model/ICredentials";
import Role from "../model/Role";

export default async function adminOnly(ctx: koa.BaseContext, next: () => Promise<any>) {
    if (ctx.state.credentials === undefined) {
        throw new UnauthorizedError();
    }

    const creds = ctx.state.credentials as ICredentials;
    if (creds.role !== Role.Admin) {
        throw new UnauthorizedError();
    }

    await next();
}
