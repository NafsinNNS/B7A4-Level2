import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentRequestService } from "./rentRequest.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createRentRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await rentRequestService.createRentRequest(userId as string, payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Rent request created successfully",
        data: result,
    });
});

const getRentRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await rentRequestService.getRentRequest(userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rent requests fetched successfully",
        data: result,
    });
})

const getRentRequestDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.id;
    if (!requestId) {
        return next(new Error("Request ID is required"));
    }

    const result = await rentRequestService.getRentRequestDetails(requestId as string);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rent request details fetched successfully",
        data: result,
    });
})

export const rentRequestController = {
    createRentRequest,
    getRentRequest,
    getRentRequestDetails,
};