import {Request, Response, NextFunction} from "express"
import { UnauthorizedException } from "../exceptions/unauthorized"
import { ErrorCode } from "../exceptions/root"
import * as jwt from "jsonwebtoken"
import {JWT_SECRET} from "../secrets"
import { prismaClient } from ".."

interface Payload {
    userId: number
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // 1. extract the token form request's Authorization Bearer Token
    const token = req.headers.authorization?.split(" ")[1]
    // 2. if the token is not present, throw an error of unauthorized 401
    if (!token) {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
    }
   try {
        // 3. if the token is present, verify that token and extract the payload
        const payload = jwt.verify(token as string, JWT_SECRET) as Payload
        // 4. to get the user from the payload
        const user = await prismaClient.user.findFirst({
            where: {
                id: payload.userId
            }
        })
        if (!user) {
            next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
        }
        // 5. to attach the user to the current request object
        req.user = user
        next()
   } catch (error) {
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED))
   }
}

export default authMiddleware