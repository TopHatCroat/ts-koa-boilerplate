export class AppError extends Error {
    public code: number;
    public name: string;

    constructor(msg: string, code: number, name: string = "AppError") {
        super(msg);
        this.code = code;
        this.name = name;
    }
}

export class NotFoundError extends AppError {
    constructor() {
        super("Not found", 404);
    }
}

export class AlreadyExists extends AppError {
    constructor(msg = "Already exists") {
        super(msg, 409);
    }
}
