import { ErrorCode, HttpException } from "./root";

export class BadRequestException extends HttpException {
    constructor(message: string, errorCode: ErrorCode) {
        super(message, errorCode, 400, "Please check your email or password.")
    }
}