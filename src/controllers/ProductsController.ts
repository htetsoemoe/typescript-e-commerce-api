import {Request, Response} from "express"
import {prismaClient} from ".."

export const createProduct = async (req: Request, res: Response) => {
    const tags = await req.body.tags.join(",")
    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags
        }
    })
    res.status(201).json(product)
}