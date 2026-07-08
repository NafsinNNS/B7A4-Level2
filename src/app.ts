import express, { Application, NextFunction, Request, Response } from "express";
import config from "./config";
import cors from "cors";
import { prisma } from "./lib/prisma";
import cookieParser from "cookie-parser";

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

export default app;