export interface ICreatePropertyPayload {
    title: string;
    description: string;
    price: number;
    location: string;
    categoryId: "APARTMENT" | "HOUSE" | "STUDIO" | "DUPLEX" | "ROOM";
    amenities?: string[];
}

export interface IUpdatePropertyPayload {
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    categoryId?: "APARTMENT" | "HOUSE" | "STUDIO" | "DUPLEX" | "ROOM";
    amenities?: string[];
}