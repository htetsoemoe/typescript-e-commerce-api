import {Request, Response} from 'express'

export const login = (req: Request, res: Response) => {
    res.json({message: "Login route is working..."})
}