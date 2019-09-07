export class AppError extends Error {
    public code: number;

    constructor(msg: string, code: number) {
        super(msg);
        this.code = code;
    }
}

export class NotFoundError extends AppError {
    constructor() {
        super("Not found", 404);
    }
}
