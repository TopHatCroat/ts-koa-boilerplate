import { AppError } from "../shared/appError";

export class UnauthorizedError extends AppError {
    constructor() {
        super("Not found", 404);
    }
}

export class InvalidCredentialsError extends AppError {
    constructor() {
        super("Invalid credentials", 401);
    }
}

export class InvalidCredentialsFormatError extends AppError {
    constructor() {
        super("Invalid credentials format", 401);
    }
}
