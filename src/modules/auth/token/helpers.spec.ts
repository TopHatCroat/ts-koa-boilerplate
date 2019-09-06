import { config } from "../../../config";
import { parseBasicAuth, parseBearerAuth } from "./helpers";
import Role from "../model/Role";
import { createJwtToken, parseJwtTokenPayload } from "./jwt";
import { InvalidCredentialsError, InvalidCredentialsFormatError } from "../errors";

describe("Auth helpers", () => {
    describe("parseBasicAuth", () => {
        it("Returns valid credentials", async () => {
            const token = (new Buffer(`${config.adminEmail}:${config.adminPassword}`)).toString("base64");
            const header = `Basic ${token}`;

            const creds = await parseBasicAuth(header);

            expect(creds.email).toEqual(config.adminEmail);
            expect(creds.token).toEqual(token);
            expect(creds.role).toEqual(Role.Admin);
        });

        it("Throws with invalid credentials", async () => {
            const token = (new Buffer(`${config.adminEmail}:not the password`)).toString("base64");
            const header = `Basic ${token}`;

            await expect(parseBasicAuth(header)).rejects.toEqual(new InvalidCredentialsError());
        });

        it("Throws with invalid token format", async () => {
            const token = (new Buffer(`invalid payload format`)).toString("base64");
            const header = `Basic ${token}`;

            await expect(parseBasicAuth(header)).rejects.toEqual(new InvalidCredentialsFormatError());
        });

        it("Throws with empty token", async () => {
            const header = "";

            await expect(parseBasicAuth(header)).rejects.toEqual(new InvalidCredentialsFormatError());
        });
    });

    describe("parseBearerAuth", () => {
        it("Returns valid credentials", async () => {
            const email = "email@test.com";
            const role = Role.User;
            const jwt = createJwtToken(email, role);
            const header = `Bearer ${jwt}`;

            const creds = await parseBearerAuth(header);

            expect(creds.email).toEqual(email);
            expect(creds.token).toEqual(jwt);
            expect(creds.role).toEqual(role);
        });


        it("Throws with empty token", async () => {
            const header = "";

            await expect(parseBearerAuth(header)).rejects.toEqual(new InvalidCredentialsFormatError());
        });
    })
});
