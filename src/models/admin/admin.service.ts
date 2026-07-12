import { ActiveStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        omit: {
            password: true,
        }
    });
    return users;
}

const updateUserStatus = async (id: string, status: string) => {
    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            activeStatus: status as ActiveStatus,
        },
        omit: {
            password: true,
        }
    });
    return updatedUser;
}

const getAllProperties = async () => {
    const properties = await prisma.property.findMany();
    return properties;
}

const getAllRentalRequests = async () => {
    const rentalRequests = await prisma.rentalRequest.findMany({
        include: {
            user: {
                omit: {
                    password: true,
                }
            },
            property: {
                include: {
                    landlord: {
                        omit: {
                            password: true,
                        }
                    }
                }
            }
        }
    });
    return rentalRequests;
}

const createCategory = async (name: string) => {
    const existingCategory = await prisma.category.findUnique({
        where: { name },
    });

    if (existingCategory) {
        throw new Error("Category already exists");
    }

    const newCategory = await prisma.category.create({
        data: { name },
    });

    return newCategory;
}

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentalRequests,
    createCategory
}