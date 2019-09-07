import supertest from "supertest";
import app from "../../app";

describe("System health router", () => {
    it("Responds with health OK", async () => {
        const response = await supertest(app.callback()).get("/system/status");
        expect(response.status).toEqual(204);
    });
});
