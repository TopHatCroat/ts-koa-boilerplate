export interface IConfig {
    port: number;
    jwtSecret: string;
    adminEmail: string;
    adminPassword: string;
}

function expectEnv(name: string): string {
    const value = process.env[name];
    if(!value) {
        throw new Error(`Missing required environmental variable: ${name}`)
    }

    return value!;
}

const config: IConfig = {
    port: parseInt(expectEnv("PORT")),
    jwtSecret: expectEnv('JWT_SECRET'),
    adminEmail: expectEnv('ADMIN_EMAIL'),
    adminPassword: expectEnv('ADMIN_PASSWORD'),
};

export { config };
