export interface ICreatePropertyPayload {
    title: string;
    description: string;
    price: number;
    location: string;
    categoryName?: string;
    amenities?: string[];
}

export interface IUpdatePropertyPayload {
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    categoryName?: string;
    amenities?: string[];
}