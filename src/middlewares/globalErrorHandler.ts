import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import Stripe from "stripe";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "Internal Server Error";

    // Prisma validation error
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "You have provided incorrect fields type or missing fields";
    }
    // Prisma known request errors
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            const field = (err.meta?.target as string[])?.join(", ") || "field";
            statusCode = httpStatus.CONFLICT;
            errorMessage = `Duplicate value found for unique field: ${field}`;
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Foreign key constraint failed";
        } else if (err.code === "P2025") {
            statusCode = httpStatus.NOT_FOUND;
            errorMessage = "Record not found";
        } else if (err.code === "P2014") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Required relation violation";
        }
    }
    // Prisma initialization error
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Database connection failed";
    }
    // Prisma unknown error
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Unknown database error";
    }
    // JWT errors
    else if (err instanceof JsonWebTokenError) {
        statusCode = httpStatus.UNAUTHORIZED;
        errorMessage = "Invalid token";
    } else if (err instanceof TokenExpiredError) {
        statusCode = httpStatus.UNAUTHORIZED;
        errorMessage = "Token has expired";
    }
    // Stripe errors
    else if (err instanceof Stripe.errors.StripeError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = err.message;
    }
    // Malformed JSON
    else if (err instanceof SyntaxError && "body" in err) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "Malformed JSON in request body";
    }
    // Custom app errors with statusCode
    else if (err.statusCode) {
        statusCode = err.statusCode;
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        name: errorName,
        message: errorMessage,
        ...(process.env.NODE_ENV === "development" && { error: err.stack }),
    });
}