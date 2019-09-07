import Koa from "koa";
import Router, { RouterContext } from "koa-router";
import { middlewares, request, summary, tags, securityAll, responses } from "koa-swagger-decorator/dist";
import authenticated from "../auth/middleware/authenticated";
import adminOnly from "../auth/middleware/adminOnly";

export default class SystemRouter {
    @request("get", "/system/status")
    @summary("Get API health status")
    @tags(["system"])
    @responses({
        201: { description: "System health is OK" },
    })
    public static async Get(context: RouterContext) {
        context.status = 204;
    }
}
