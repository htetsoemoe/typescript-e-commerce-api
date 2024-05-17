import { Request, Response } from "express"
import { AddressSchema } from "../schema/users"
import { prismaClient } from ".."
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"

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
