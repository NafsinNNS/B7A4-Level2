import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { userService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response, Next: NextFunction) => {
    const payload = req.body;

    const user = await userService.createUserIntoDB(payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: {
            user
        }
    })
})

const loginUser = catchAsync(async (req: Request, res: Response, Next: NextFunction) => {
    const payload = req.body;

    const { accessToken, refreshToken } = await userService.loginUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 1 // 1 days
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken
        }
    })
})

const getMyUser = catchAsync(async (req: Request, res: Response, Next: NextFunction) => {
    const user = req.user?.id;

    const myUser = await userService.getMyUser(user as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User fetched successfully",
        data: {
            myUser
        }
    })
})

export const authController = {
    registerUser,
    loginUser,
    getMyUser
}