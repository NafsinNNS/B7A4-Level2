import { PropertyWhereInput } from "../../../generated/prisma/models";
import { PropertyCategory } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IPropertyQuery } from "./property.interface";

const getAllProperties = async (query: IPropertyQuery) => {
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"

    const andConditions: PropertyWhereInput[] = [];

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: query.searchTerm, mode: "insensitive" } },
                { description: { contains: query.searchTerm, mode: "insensitive" } },
                { location: { contains: query.searchTerm, mode: "insensitive" } },
            ],
        });
    }

    if (query.title) {
        andConditions.push({
            title: query.title,
        });
    }
    if (query.price) {
        andConditions.push({
            price: Number(query.price),
        });
    }
    if (query.maxPrice) {
        andConditions.push({
            price: { lte: Number(query.maxPrice) },
        });
    }
    if (query.location) {
        andConditions.push({
            location: query.location,
        });
    }
    if (query.categoryName) {
        andConditions.push({
            categoryName: query.categoryName,
        });
    }

    const properties = await prisma.property.findMany({
        where: {
            AND: andConditions,
        },
        orderBy: {
            [sortBy]: sortOrder,
        }
    });

    return properties;
}

const getPropertyDetails = async (propertyId: string) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    return property;
}

export const propertyService = {
    getAllProperties,
    getPropertyDetails,
};