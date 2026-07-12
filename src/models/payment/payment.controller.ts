import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const rentalRequestId = req.params.id;

    const result = await paymentService.createPayment(userId as string, rentalRequestId as string);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment created successfully",
        data: result,
    });
})

const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

export const paymentController = {
    createPayment,
    handleWebhook,
};