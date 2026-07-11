import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { landlordService } from "./landlord.service";

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await landlordService.createProperty(userId as string, payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Property created successfully",
        data: result,
    });
})

const updateProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const propertyId = req.params.id;
    const isAdmin = req.user?.role === "ADMIN";
    const payload = req.body;

    if (!propertyId) {
        return next(new Error("Property ID is required"));
    }

    const result = await landlordService.updateProperty(userId as string, propertyId as string, payload, isAdmin);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Property updated successfully",
        data: result,
    });
})

const deleteProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const propertyId = req.params.id;
    const isAdmin = req.user?.role === "ADMIN";

    if (!propertyId) {
        return next(new Error("Property ID is required"));
    }

    const post = await landlordService.deleteProperty(userId as string, propertyId as string, isAdmin);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Property deleted successfully",
        data: post,
    });
})

const getAllRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await landlordService.getAllRequests(userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Requests fetched successfully",
        data: result,
    });
})

const updateRequestStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const requestId = req.params.id;
    const status = req.body.status;

    if (!requestId) {
        return next(new Error("Request ID is required"));
    }

    if (!status) {
        return next(new Error("Status is required"));
    }

    const result = await landlordService.updateRequestStatus(userId as string, requestId as string, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Request status updated successfully",
        data: result,
    });
})

export const landlordController = {
    createProperty,
    updateProperty,
    deleteProperty,
    getAllRequests,
    updateRequestStatus,
};