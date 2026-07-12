import { prisma } from "../../lib/prisma";

const getPropertyCategories = async () => {
    const categories = await prisma.category.findMany();
    return categories;
}

export const categoryService = {
    getPropertyCategories,
};