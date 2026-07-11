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

export const adminService = {
    getAllUsers,
    updateUserStatus,
}