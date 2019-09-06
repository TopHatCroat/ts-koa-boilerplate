export default class AppError extends Error {
    public code: number;

    constructor(msg: string, code: number) {
        super(msg);
        this.code = code;
    }
}
