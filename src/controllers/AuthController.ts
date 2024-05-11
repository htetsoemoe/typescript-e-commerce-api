import {Request, Response, NextFunction} from 'express'
import { prismaClient } from '..'
import {hashSync, compareSync} from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'
import {BadRequestException} from '../exceptions/bad-request'
import { ErrorCode } from '../exceptions/root'
import { UnprocessableEntity } from '../exceptions/validation'
import { SignUpSchema } from '../schema/users'
import { NotFoundException } from '../exceptions/not-found'

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
} | null

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
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
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body
    let user: User = await prismaClient.user.findFirst({
        where: {
            email
        }
    })

    if (!user) {
        throw new NotFoundException("Incorrect Email", ErrorCode.USER_NOT_FOUND)
    }
    if (!compareSync(password, user.password)) {
        throw new BadRequestException("Incorrect Password", ErrorCode.INCORRECT_PASSWORD)
    }

    // Generate JWT Token
    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)
    
    const {password: pass, createdAt, updatedAt, ...rest} = user
    res.status(200).json({user: rest, token})
}