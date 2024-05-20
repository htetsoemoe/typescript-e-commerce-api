import { Request, Response } from "express"
import { CartItemSchema, CartQuantitySchema } from "../schema/cart"
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

    // check a found product was already existed in as cartItem
    const existedProduct = await prismaClient.cartItem.findFirst({
        where: {
            productId: product.id
        }
    })

    // and we need to find there was already existed cartItem
    const existedCartItem = await prismaClient.cartItem.findFirst({
        where: {
            productId: existedProduct?.id
        }
    })

    // If there was already existed in cartItem, only need to be update product's quantity
    if (existedProduct && existedCartItem) {
        let onlyUpdatedProductQty = await prismaClient.cartItem.update({
            where: {
                id: existedCartItem?.id
            },
            data: {
                quantity: existedProduct.quantity + 1
            }
        })
        res.status(200).json(onlyUpdatedProductQty)
    } else {    // OR create a cartItem
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
}

export const getCart = async (req: Request, res: Response) => {
    const cartItems = await prismaClient.cartItem.findMany({
        where: {
            user: {
                id: parseInt(req.user.id)
            }
        },
        include: {
            product: true
        }
    })
    res.status(200).json(cartItems)
}

export const changeQuantity = async (req: Request, res: Response) => {
    const validateData = CartQuantitySchema.parse(req.body)

    const updateCartProductQuantity = await prismaClient.cartItem.update({
        where: {
            id: parseInt(req.params.id) // cartItem's ID
        },
        data: {
            quantity: validateData.quantity
        }
    })
    res.status(200).json(updateCartProductQuantity)
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    const deletedCartItem = await prismaClient.cartItem.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.status(200).json(deletedCartItem)
}
