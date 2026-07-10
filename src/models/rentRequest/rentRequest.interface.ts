export interface ICreateRentRequestPayload {
    userId: string;
    propertyId: string;
    approveStatus: "PENDING" | "APPROVED" | "REJECTED";
    paymentStatus: "UNPAID" | "PAID" | "FAILED";
}