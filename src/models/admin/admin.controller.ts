import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsers();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrieved successfully",
        data: result,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const status = req.body.status;

    if (!userId) {
        return next(new Error("User ID is required"));
    }

    if (!status) {
        return next(new Error("Status is required"));
    }

    const validStatuses = ["ACTIVE", "INACTIVE"];
    if (!validStatuses.includes(status)) {
        return next(new Error("Invalid status value. Allowed values are: ACTIVE, INACTIVE"));
    }

    const result = await adminService.updateUserStatus(userId as string, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User status updated successfully",
        data: result,
    });
})

export const adminController = {
    getAllUsers,
    updateUserStatus,
}