import { RouterContext } from "koa-router";
import {params, request, responses, security, summary, tags} from "koa-swagger-decorator/dist";

import { parseBasicAuth } from "./token/helpers";
import { createJwtToken } from "./token/jwt";
import { respondWithError } from "../shared/response";

const loginResponseDescription = {
    type: "object",
    properties: {
        token: { type: "string", description: "JWT to use for other endpoints" },
    },
};

export default class AuthRouter {

    @request("post", "/login")
    @security([{ BasicAuth: [] }])
    @summary("Used to acquire authorization token")
    @tags(["auth"])
    @responses({
        201: { description: "Successful login", content: { "application/json": { schema: loginResponseDescription } } },
    })
    public static async Login(ctx: RouterContext) {
        const token = ctx.request.headers.authorization || "";
        await parseBasicAuth(token)
            .then((creds) => createJwtToken(creds.email, creds.role))
            .then((jwt) => {
                ctx.status = 201;
                ctx.body = {
                    token: jwt,
                };
            })
            .catch((e) => {
                respondWithError(ctx, e);
            });
    }
}
