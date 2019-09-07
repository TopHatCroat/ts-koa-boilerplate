import * as path from "path";
import Koa from "koa";
import Router from "koa-router";
import koaBodyParser from "koa-bodyparser";
import koaCors from "koa-cors";
import koaStatic from "koa-static";
import { SwaggerRouter } from "koa-swagger-decorator/dist";

import systemRouter from "./modules/system/router"
import authRouter from "./modules/auth/router"
import bookingRouter from "./modules/booking/router"
import defaultErrorHandler from "./service/errorHandler";

const router = new SwaggerRouter();
router.swagger({
    title: "Example REST API server",
    description: "Bootstrap server using TypeScript, Koa, Jest and Swagger",
    version: "1.0.0",
    swaggerOptions: {
        securityDefinitions: {
            BasicAuth: {
                type: "basic",
                description: "Basic authentication for acquiring JWT",
                in: "header",
                name: "Authorization"
            },
            BearerAuth: {
                type: "apiKey",
                description: "JWT for all other endpoints",
                in: "header",
                name: "Authorization"
            }
        }
    }
});
router.mapDir(path.join(__dirname, "modules"), { ignore: ["**/?(*.)spec.ts"] });

const app = new Koa();
app.use(defaultErrorHandler())
    .use(koaCors())
    .use(koaStatic("."))
    .use(koaBodyParser())
    .use(router.routes())
    .use(router.allowedMethods());


export default app;
