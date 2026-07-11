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

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentalRequests,
}