import AppError from "../shared/AppError";

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