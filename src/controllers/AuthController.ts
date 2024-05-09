import {Request, Response} from 'express'
import { prismaClient } from '..'
import {hashSync} from 'bcrypt'

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

export const login = (req: Request, res: Response) => {
    res.json({message: "Login route is working..."})
}