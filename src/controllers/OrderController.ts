import { Request, Response } from "express"
import { prismaClient } from ".."

export const createOrder = async (req: Request, res: Response) => {
    // 1. to create a transactions
    // 2. to list all the cart items and proceed if cart is not empty
    // 3. calculate the total amount
    // 4. fetch address of user
    // 5. to define computed field for formatted address on address module
    // 6. we will create a order, productOrder and products
    // 7. create event
    // 8. to empty the cart
    console.log(req.user)
    return await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        })

        if (cartItems.length === 0) {
            return res.status(404).json({message: "Cart is empty!"})
        }

        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * parseInt(current.product.price.toString()))
        }, 0)

        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress
            }
        })

        // ManyToMany relationship between order and product
        const order = await tx.order.create({
            data: {
                user: {
                    connect: {
                        id: req.user.id
                    }
                },
                netAmount: price,
                address: (address as any).formattedAddress,
                products: {
                    create: cartItems.map((cartItem) => ({
                        product: {
                            connect: {
                                id: cartItem.productId
                            }
                        },
                        quantity: cartItem.quantity
                    }))
                } 
            }
        })

        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id
            }
        })

        // Finally we need to delete all cartItems
        await tx.cartItem.deleteMany({
            where: {
                userId: req.user.id
            }
        })

        return res.status(200).json(order)
    })
}

export const listOrder = async (req: Request, res: Response) => {

}

export const cancelOrder = async (req: Request, res: Response) => {

}

export const getOrderById = async (req: Request, res: Response) => {

}