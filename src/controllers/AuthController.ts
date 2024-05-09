import {Request, Response} from 'express'
import { prismaClient } from '..'
import {hashSync, compareSync} from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
} | null

export const signUp = async (req: Request, res: Response) => {
    const {name, email, password} = req.body

    let user: User = await prismaClient.user.findFirst({
        where: {
            email: email
        }
    })

    if (user) {
        throw Error('User already exists!')
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