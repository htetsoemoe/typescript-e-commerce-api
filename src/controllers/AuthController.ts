import {Request, Response, NextFunction} from 'express'
import { prismaClient } from '..'
import {hashSync, compareSync} from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'
import {BadRequestException} from '../exceptions/bad-request'
import { ErrorCode } from '../exceptions/root'
import { UnprocessableEntity } from '../exceptions/validation'
import { SignUpSchema } from '../schema/users'

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
} | null

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Firstly we need to validate user inputs with zod validation schema(SignUpSchema)
        SignUpSchema.parse(req.body)
        const {name, email, password} = req.body
        let user: User = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })
        if (user) {
            return next(new BadRequestException("User already exists!", ErrorCode.USER_ALREADY_EXISTS))
        }
        user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10)
            }
        })
        const {password: pass, ...rest} = user
        res.status(201).json(rest)
    } catch (err: any) {
        next(new UnprocessableEntity(err?.issues, "Unprocessable Entity", ErrorCode.UNPROCESSABLE_ENTITY))
    }
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    let user: User = await prismaClient.user.findFirst({
        where: {
            email
        }
    })
    
    if (!user) {
        throw Error("User doesn't exist!")
    }

    if (!compareSync(password, user.password)) {
        throw Error("Incorrect password!")
    }

    // Generate JWT Token
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    const {password: pass, ...rest} = user

    res.status(200).json({user: rest, token})
}