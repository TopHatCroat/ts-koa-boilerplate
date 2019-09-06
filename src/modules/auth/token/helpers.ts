import { config } from "../../../config";
import Role from "../model/Role";
import { parseJwtTokenPayload } from "./jwt";
import { InvalidCredentialsError, InvalidCredentialsFormatError } from "../errors";
import { ICredentials } from "../model/ICredentials";

function isValidCredentials(email: string, password: string): boolean {
    if (email === config.adminEmail && password === config.adminPassword) {
        return true;
    }

    return false;
}

export async function parseBasicAuth(token: string): Promise<ICredentials> {
    if (!token.startsWith("Basic")) {
        throw new InvalidCredentialsFormatError();
    }

    let strippedToken = token.replace("Basic ", "");
    const b64decoded = Buffer.from(strippedToken, "base64").toString("ascii");
    const creds = b64decoded.split(":");
    if (creds.length !== 2) {
        throw new InvalidCredentialsFormatError();
    }

    if (!isValidCredentials(creds[0], creds[1])) {
        throw new InvalidCredentialsError();
    }

    return {
        email: creds[0],
        token: strippedToken,
        role: Role.Admin
    }
}

export async function parseBearerAuth(token: string): Promise<ICredentials> {
    if (!token.startsWith("Bearer")) {
        throw new InvalidCredentialsFormatError();
    }

    try {
        const strippedToken = token.replace("Bearer ", "");
        const payload = parseJwtTokenPayload(strippedToken);
        return {
            email: payload.email,
            role: payload.role,
            token: strippedToken,
        }
    } catch (e) {
        throw new InvalidCredentialsError();
    }
}
