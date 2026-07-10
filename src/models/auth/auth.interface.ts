import { Role } from "../../../generated/prisma/enums";

export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "LANDLORD" | "TENANT";
}