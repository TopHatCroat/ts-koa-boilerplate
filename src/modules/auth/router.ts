import Router from "koa-router";

import { parseBasicAuth } from "./helpers";
import { createJwtToken } from "./jwt";
import { respondWithError } from "../shared/response";

const router = new Router();

router.post('/login',
    async (ctx) => {
        const token = ctx.request.headers["authorization"] || "";
        await parseBasicAuth(token)
            .then((creds) => createJwtToken(creds.email, creds.role))
            .then((token) => {
                ctx.status = 201;
                ctx.body = {
                    token,
                }
            })
            .catch((e) => {
                respondWithError(ctx, e);
            });
    }
);

export default router;
