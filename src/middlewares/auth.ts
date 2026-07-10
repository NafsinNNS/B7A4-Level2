import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: Role;
            };
        }
    }
}

// auth guard
// auth() => ...requiredRoles = > [Role.USER, Role.ADMIN, Role.AUTHOR]
export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;

        if (!token) {
            throw new Error("You are not logged in! Please log in to get access.");
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }

        const { id, email, name, role } = verifiedToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("You do not have permission to perform this action");
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                name,
                role,
            }
        })

        if (!user) {
            throw new Error("User not found");
        }

        if (user.activeStatus === "INACTIVE") {
            throw new Error("Your account is inactive. Please contact support.");
        }
        req.user = {
            id,
            email,
            name,
            role,
        }
        next();
    })
}