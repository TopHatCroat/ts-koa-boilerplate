export default class AppErrors extends Error {
    public code: number;

    constructor(msg: string, code: number) {
        super(msg);
        this.code = code;
    }
}

export class NotFoundError extends AppErrors {
    constructor() {
        super("Not found", 404);
    }
}
