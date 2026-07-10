import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { landlordService } from "./landlord.service";
import { IUpdatePropertyPayload } from "./landlord.interface";

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

export const landlordController = {
    createProperty,
    updateProperty,
    deleteProperty,
};