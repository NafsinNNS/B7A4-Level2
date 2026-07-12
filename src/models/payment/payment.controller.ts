import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const rentalRequestId = req.params.id;

    const result = await paymentService.createPayment(userId as string, rentalRequestId as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Payment created successfully",
        data: result,
    });
})

const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers['stripe-signature']!;

    await paymentService.handleWebhook(event, signature as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Webhook received successfully",
        data: null
    })
})

export const paymentController = {
    createPayment,
    handleWebhook,
};