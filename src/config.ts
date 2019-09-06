import * as Dotenv from "dotenv";

export interface IConfig {
    port: number;
}

function expectEnv(name: string): string {
    const value = process.env[name];
    if(!value) {
        throw new Error(`Missing required environmental variable: ${name}`)
    }

    return value!;
}

Dotenv.config();


const config = {
    port: expectEnv("PORT"),
};

export { config };
