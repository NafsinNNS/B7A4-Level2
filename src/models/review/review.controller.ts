import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";;
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const rentalRequestId = req.params.id;
    const payload = req.body;

    if (!rentalRequestId) {
        return next(new Error("Rental Request ID is required"));
    }

    const result = await reviewService.createReview(userId as string, rentalRequestId as string, payload);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Review created successfully",
        data: result
    });
});

export const reviewController = {
    createReview,
}