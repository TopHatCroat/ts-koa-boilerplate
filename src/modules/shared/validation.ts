import AppError from "./AppError";

export class ValidationError extends AppError {
    constructor(msg: string) {
        super(msg, 412);
    }
}

export function regexValidated(data: string, regex: RegExp, errorMessage: string) {
    if(!regex.test(data)) {
        throw new ValidationError(errorMessage)
    }

    return data;
}
