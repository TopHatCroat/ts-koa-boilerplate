import AppErrors from "../shared/appErrors";

export class UnauthorizedError extends AppErrors {
    constructor() {
        super("Not found", 404);
    }
}

export class InvalidCredentialsError extends AppErrors {
    constructor() {
        super("Invalid credentials", 401);
    }
}

export class InvalidCredentialsFormatError extends AppErrors {
    constructor() {
        super("Invalid credentials format", 401);
    }
}
