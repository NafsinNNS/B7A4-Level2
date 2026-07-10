import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const properties = await propertyService.getAllProperties(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Properties retrieved successfully",
        data: properties,
    });
})

const getPropertyDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id;
    const property = await propertyService.getPropertyDetails(propertyId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Property details retrieved successfully",
        data: property,
    });
})

export const propertyController = {
    getAllProperties,
    getPropertyDetails,
};