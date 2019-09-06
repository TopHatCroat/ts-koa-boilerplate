import request from "supertest";
import app from "./../../app";
import {config} from "../../config";
import {InvalidCredentialsFormatError} from "./errors";

const mockListen = jest.fn();
app.listen = mockListen;

afterEach(() => {
    mockListen.mockReset();
});

describe("Auth router", () => {
    it("Responds with valid login token", async () => {
        const token = (new Buffer(`${config.adminEmail}:${config.adminPassword}`)).toString("base64");
        const header = `Basic ${token}`;

        const response = await request(app.callback())
            .post("/login")
            .set({ Authorization:  header});

        expect(response.status).toEqual(201);
        expect(response.body.token).toMatch(/.*\..*\..*/);
    });

    it("Responds with Unauthorized 401 for invalid credentials", async () => {
        const token = (new Buffer(`invalid credentials`)).toString("base64");
        const header = `Basic ${token}`;

        const response = await request(app.callback())
            .post("/login")
            .set({ Authorization:  header});

        expect(response.status).toEqual(401);
        expect(response.body.message).toEqual((new InvalidCredentialsFormatError()).message);
    });
});
