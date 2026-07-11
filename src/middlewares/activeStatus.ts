import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";

export const activeStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new Error("You are not logged in! Please log in to get access.");
    }

    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { activeStatus: true },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.activeStatus === "INACTIVE") {
        throw new Error("Your account is inactive. Please contact support.");
    }

    next();
});
