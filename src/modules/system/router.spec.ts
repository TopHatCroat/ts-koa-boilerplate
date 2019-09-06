import request from "supertest";
import app from "./../../app";

const mockListen = jest.fn();
app.listen = mockListen;

afterEach(() => {
    mockListen.mockReset();
});

describe("System health router", () => {
    it("Responds with health OK", async () => {
        const response = await request(app.callback()).get("/system/status");
        expect(response.status).toEqual(204);
    });
});
