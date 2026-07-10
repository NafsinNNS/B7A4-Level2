import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { categoryService } from "./category.service";

const getPropertyCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await categoryService.getPropertyCategories();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Property categories retrieved successfully",
        data: categories,
    });
})

export const categoryController = {
    getPropertyCategories,
};