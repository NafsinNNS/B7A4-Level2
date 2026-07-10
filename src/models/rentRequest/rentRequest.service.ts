import { prisma } from "../../lib/prisma";
import { ICreateRentRequestPayload } from "./rentRequest.interface";

const createRentRequest = async (userId: string, payload: ICreateRentRequestPayload) => {
    const result = await prisma.rentalRequest.create({
        data: {
            ...payload,
            userId: userId,
        },
    });
    return result;
}

const getRentRequest = async (userId: string) => {
    const result = await prisma.rentalRequest.findMany({
        where: {
            userId: userId,
        }
    })
    return result;
}

const getRentRequestDetails = async (requestId: string) => {
    const result = await prisma.rentalRequest.findUnique({
        where: {
            id: requestId,
        }
    });
    return result;
}

export const rentRequestService = {
    createRentRequest,
    getRentRequest,
    getRentRequestDetails,
};