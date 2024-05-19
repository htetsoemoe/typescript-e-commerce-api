import { Request, Response } from "express"
import { CartItemSchema } from "../schema/cart"
import { Product } from "@prisma/client"
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"
import { prismaClient } from ".."

export const addItemToCart = async (req: Request, res: Response) => {
    const validateData = CartItemSchema.parse(req.body)
    let product: Product

    // find a product
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validateData.productId
            }
        })
    } catch (error) {
        throw new NotFoundException("Product not found!", ErrorCode.PRODUCT_NOT_FOUND)
    }

    // create a cartItem
    let cartItem = await prismaClient.cartItem.create({
        data: {
            quantity: validateData.quantity,
            user: {
                connect: {
                    id: parseInt(req.user.id)
                }
            },
            product: {
                connect: {
                    id: product.id
                }
            }
        }
    })

    res.status(201).json(cartItem)
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    
}

export const changeQuantity = async (req: Request, res: Response) => {
    
}

export const getCart = async (req: Request, res: Response) => {
    
}