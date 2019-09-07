export interface IConfig {
    port: number;
    jwtSecret: string;
    adminEmail: string;
    adminPassword: string;
    mongoLocation: string;
    mongoPort: string;
    mongoName: string;
    sendGridKey?: string;
    emailFrom?: string;
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
    mongoLocation: expectEnv('MONGO_LOCATION'),
    mongoPort: expectEnv('MONGO_PORT'),
    mongoName: expectEnv('MONGO_NAME'),
    sendGridKey: process.env.SENDGRID_API_KEY,
    emailFrom: process.env.EMAIL_FROM,
};

export { config };
