import { PropertyWhereInput } from "../../../generated/prisma/models";

export interface IPropertyQuery extends PropertyWhereInput {
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
    maxPrice?: number;
}