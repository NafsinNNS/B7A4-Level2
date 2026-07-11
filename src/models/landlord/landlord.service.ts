import { ApproveStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePropertyPayload, IUpdatePropertyPayload } from "./landlord.interface";

const createProperty = async (userId: string, payload: ICreatePropertyPayload) => {
    const result = await prisma.property.create({
        data: {
            ...payload,
            landlordId: userId,
        },
    });
    return result;
};

const updateProperty = async (userId: string, propertyId: string, payload: IUpdatePropertyPayload, isAdmin: boolean) => {
    const post = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        }
    });

    if (!isAdmin && post.landlordId !== userId) {
        throw new Error("You are not authorized to update this property");
    }

    const result = await prisma.property.update({
        where: {
            id: propertyId,
        },
        data: payload,
    });
    return result;
}

const deleteProperty = async (userId: string, propertyId: string, isAdmin: boolean) => {
    const post = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        }
    });

    if (!isAdmin && post.landlordId !== userId) {
        throw new Error("You are not authorized to delete this property");
    }

    const result = await prisma.property.delete({
        where: {
            id: propertyId,
        },
    });
    return result;
}

const getAllRequests = async (userId: string) => {
    const result = await prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId: userId,
            },
        },
        include: {
            property: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            }
        },
    });
    return result;
}

const updateRequestStatus = async (userId: string, requestId: string, status: string) => {
    const request = await prisma.rentalRequest.findUniqueOrThrow({
        where: {
            id: requestId,
        }
    });

    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: request.propertyId,
        }
    });

    if (property.landlordId !== userId) {
        throw new Error("You are not authorized to update this request");
    }

    const result = await prisma.rentalRequest.update({
        where: {
            id: requestId,
        },
        data: {
            approveStatus: status as ApproveStatus,
        },
    });
    return result;
}

export const landlordService = {
    createProperty,
    updateProperty,
    deleteProperty,
    getAllRequests,
    updateRequestStatus,
};