import { Request, Response } from "express"

export const createOrder = async (req: Request, res: Response) => {
    res.status(201).json({message: "createOrder api route is working..."})
}

export const listOrder = async (req: Request, res: Response) => {

}

export const cancelOrder = async (req: Request, res: Response) => {

}

export const getOrderById = async (req: Request, res: Response) => {

}