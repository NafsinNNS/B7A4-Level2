import { PropertyCategory } from "../../../generated/prisma/enums";

const getPropertyCategories = async () => {
    return Object.values(PropertyCategory);
}

export const categoryService = {
    getPropertyCategories,
};