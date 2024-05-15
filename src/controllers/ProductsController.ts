import {Request, Response} from "express"
import {prismaClient} from ".."
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"

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

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body
        if (product.tags) {
            product.tags = product.tags.join(',')
        }
        const updatedProduct = await prismaClient.product.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: product
        })
        res.status(200).json(updatedProduct)
    } catch (error) {
        throw new NotFoundException("Product Not Found!", ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const listProducts = async (req: Request, res: Response) => {
    const skip = parseInt(req.query.skip as string) || 0

    const count = await prismaClient.product.count()
    const products = await prismaClient.product.findMany({
        skip: skip,
        take: 10
    })
    res.status(200).json({count, data: products})
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.status(200).json(product)
    } catch (error) {
        throw new NotFoundException("Product Not Found!", ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deletedProduct = await prismaClient.product.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.status(200).json(deletedProduct)
    } catch (error) {
        throw new NotFoundException("Product Not Found!", ErrorCode.PRODUCT_NOT_FOUND)
    }
}