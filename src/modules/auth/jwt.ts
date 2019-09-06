import * as jsonwebtoken from "jsonwebtoken";
import { config } from "../../config";
import Role from "./Role";

const USER_SUBJECT = "user";
const APP_DOMAIN = "app.example.com";

interface IPayload {
    email: string,
    role: Role
}

export function parseJwtTokenPayload(token: string): IPayload {
    const decoded = jsonwebtoken.verify(
        token,
        config.jwtSecret,
        {
            subject: USER_SUBJECT,
            issuer: APP_DOMAIN,
        });

    return decoded as IPayload;
}

export function createJwtToken(email: string, role: Role): string {
    return jsonwebtoken.sign(
        { email, role },
        config.jwtSecret,
        {
            expiresIn: "1 hour",
            subject: USER_SUBJECT,
            issuer: APP_DOMAIN,
        }
    );
}
