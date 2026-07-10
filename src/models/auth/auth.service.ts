import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { CreateUserPayload } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const createUserIntoDB = async (payload: CreateUserPayload) => {
    const { name, email, password, role } = payload;

    const isUserExists = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExists) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email || email
        },
        omit: {
            password: true
        }
    })

    return user;
}

const loginUser = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    const user = await prisma.user.findFirst({
        where: { email }
    })

    if (!user) {
        throw new Error("User does not exist");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Invalid credentials");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return { accessToken, refreshToken };
}

const getMyUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        omit: {
            password: true
        }
    })
    return user;
}

export const userService = {
    createUserIntoDB,
    loginUser,
    getMyUser
}