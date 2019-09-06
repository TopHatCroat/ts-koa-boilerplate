import * as crypto from "crypto";

export default function generateValidationCode(n: number) {
    const base = crypto.randomBytes(16).toString("hex");
    return (new Buffer(`${n}${base}`)).toString("base64").substr(0, 8);
}
