import { ErrorCode, HttpException } from "./root";

export class BadRequestException extends HttpException {
    constructor(message: string, errorCode: ErrorCode) {
        super(message, errorCode, 400, "Email is already exist! Please use different email address.")
    }
}