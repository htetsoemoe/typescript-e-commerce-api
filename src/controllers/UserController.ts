import { Request, Response } from "express"

export const createAddress = async (req: Request, res: Response) => {
    res.status(201).json({message: "createAddress API route is working"})
}

export const updateAddress = async (req: Request, res: Response) => {
    res.status(200).json({message: "updateAddress API route is working"})
}

export const deleteAddress = async (req: Request, res: Response) => {
    res.status(200).json({message: "deleteAddress API route is working"})
}

export const getAllAddress = async (req: Request, res: Response) => {
    res.status(200).json({message: "getAllAddress API route is working"})
}
