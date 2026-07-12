import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";

const createReview = async (userId: string, rentalRequestId: string, payload: ICreateReviewPayload) => {
    const doesReviewExist = await prisma.review.findFirst({
        where: {
            userId,
            propertyId: (await prisma.rentalRequest.findUnique({
                where: { id: rentalRequestId },
                select: { propertyId: true }
            }))?.propertyId
        }
    });

    if (doesReviewExist) {
        throw new Error("You have already reviewed this property.");
    }

    const statusIsCompleted = await prisma.rentalRequest.findFirst({
        where: {
            userId,
            id: rentalRequestId,
            approveStatus: "COMPLETED",
            paymentStatus: "PAID"
        }
    });

    if (!statusIsCompleted) {
        throw new Error("You can only review a property after completing a rental request for it.");
    }

    if (payload.rating < 1 || payload.rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
    }

    const result = await prisma.review.create({
        data: {
            userId,
            propertyId: statusIsCompleted.propertyId,
            ...payload
        },
        include: {
            user: {
                omit: {
                    password: true,
                }
            },
            property: true
        }
    });
    return result;
};

export const reviewService = {
    createReview,
};