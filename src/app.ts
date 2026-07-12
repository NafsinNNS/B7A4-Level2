import express, { Application, NextFunction, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import { prisma } from "./lib/prisma";
import cookieParser from "cookie-parser";
import { authRoutes } from "./models/auth/auth.route";
import { propertyRoutes } from "./models/property/property.route";
import { landlordRoutes } from "./models/landlord/landlord.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { categoryRoutes } from "./models/category/category.route";
import { rentRequestRoutes } from "./models/rentRequest/rentRequest.route";
import { adminRoute } from "./models/admin/admin.route";
import { reviewRouter } from "./models/review/review.route";

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
    // const user = await prisma.user.findMany();
    // console.log("Users:", user);
    res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/rentals", rentRequestRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/reviews", reviewRouter);

app.use(globalErrorHandler);

export default app;