import { Request, Response } from "express"
import { AddressSchema, UserSchema } from "../schema/users"
import { prismaClient } from ".."
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"
import { Address } from "@prisma/client"
import { BadRequestException } from "../exceptions/bad-request"

export const createAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body)

    // Create a new address record and connect to existing user record 
    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            User: {
                connect: {
                    id: req.user.id
                }
            }
        }
    })

    res.status(201).json(address)
}

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const address = req.body
        const updatedAddress = await prismaClient.address.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: address
        })
        res.status(200).json(updatedAddress)
    } catch (error) {
        throw new NotFoundException("Address Not Found!", ErrorCode.ADDRESS_NOT_FOUND)
    }
}

export const getAllAddress = async (req: Request, res: Response) => {
    try {
        const addresses = await prismaClient.address.findFirstOrThrow({
            where: {
                User: {
                    id: req.user.id
                }
            }
        })
        res.status(200).json(addresses)
    } catch (error) {
        throw new NotFoundException("Address Not Found!", ErrorCode.ADDRESS_NOT_FOUND)
    }
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const deletedAddress = await prismaClient.address.delete({
            where: {
                id: parseInt(req.params.id),
                AND: [{
                    User: {
                        id: req.user.id
                    }
                }]
            }
        })
        res.status(200).json(deletedAddress)
    } catch (error) {
        throw new NotFoundException("Address Not Found!", ErrorCode.ADDRESS_NOT_FOUND)
    }
}

export const listUsers = async (req: Request, res: Response) => {
    const users = await prismaClient.user.findMany({
        skip: parseInt(req.query.skip as string) || 0,
        take: 5
    })
    res.status(200).json(users)
}

export const updateUser = async (req: Request, res: Response) => {
    const validateData = UserSchema.parse(req.body)
    let shippingAddress: Address
    let billingAddress: Address

    if (validateData.defaultShippingAddress) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validateData.defaultShippingAddress
                }
            })
        } catch (error) {
            throw new NotFoundException("Address not found!", ErrorCode.ADDRESS_NOT_FOUND)
        }
        // check there is equal to found address object's userId and current signed in userId
        if (shippingAddress.userId != req.user.id) {
            throw new BadRequestException("Address does not belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG_TO_USER)
        }
    }

    if (validateData.defaultBillingAddress) {
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validateData.defaultBillingAddress
                }
            })
        } catch (error) {
            throw new NotFoundException("Address not found!", ErrorCode.ADDRESS_NOT_FOUND)
        }
        if (billingAddress.userId != req.user.id) {
            throw new BadRequestException("Address does not belong to user", ErrorCode.ADDRESS_DOES_NOT_BELONG_TO_USER)
        }
    }

    const updatedUser = await prismaClient.user.update({
        where: {
            id: req.user.id
        },
        data: validateData
    })
    res.status(200).json(updatedUser)
}
