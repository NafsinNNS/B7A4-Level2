import config from "../../config";
import { stripe } from "../../config/stripe";
import { prisma } from "../../lib/prisma";
import { handleChangeSubscription, handleCheckoutCompleted } from "./payent.utils";

const createPayment = async (userId: string, rentalRequestId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                payments: true,
            }
        });

        const rentalRequest = await tx.rentalRequest.findUnique({
            where: {
                id: rentalRequestId,
            },
            select: {
                property: {
                    select: {
                        price: true,
                    }
                }
            }
        });

        const price = rentalRequest?.property?.price;

        const isApproved = await tx.rentalRequest.findFirst({
            where: {
                id: rentalRequestId,
                approveStatus: "APPROVED",
            }
        });

        if (!isApproved) {
            throw new Error("Rental request is not approved yet.");
        }

        let StripeCustomerId = user?.payments.find(payment => payment.rentalRequestId === rentalRequestId)?.stripeCustomerId;

        if (!StripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user?.email,
                name: user?.name,
                metadata: {
                    userId: user!.id,
                }
            });
            StripeCustomerId = customer.id;
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        unit_amount: price! * 100,
                        recurring: { interval: "month" },
                        product_data: {
                            name: "Rent Payment",
                        },
                    },
                    quantity: 1,
                }
            ],
            mode: 'subscription',
            customer: StripeCustomerId,
            payment_method_types: ['card'],
            success_url: `${config.app_url}/payment/success=true`,
            cancel_url: `${config.app_url}/payment/success=false`,
            metadata: {
                userId: user!.id,
                rentalRequestId: rentalRequestId,
            }
        })
        return session.url;
    })
    return {
        paymentUrl: transactionResult,
    }
}

const handleWebhook = async (payload: Buffer, signature: string) => {
    console.log("Webhook received, verifying signature...");
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe_webhook_secret
    );

    switch (event.type) {
        case 'checkout.session.completed':
            console.log("Checkout session completed, handling...");
            await handleCheckoutCompleted(event.data.object);
            break;

        case 'customer.subscription.updated':
            await handleChangeSubscription(event.data.object);
            // for update - stripe trigger customer.subscription.updated
            break;
        case 'customer.subscription.deleted':
            await handleChangeSubscription(event.data.object);
            // to delete just run stripe subscriptions cancel your_sub_id
            break;
        default:
            console.log(`No event matched. Unhandled event type ${event.type}`);
            break;
    }
}

const getPaymentsByUserId = async (userId: string) => {
    const payments = await prisma.payment.findMany({
        where: {
            userId,
        },
        include: {
            rentalRequest: true,
        }
    });
    return payments;
}

const getPaymentDetails = async (userId: string, paymentId: string) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id: paymentId,
            userId,
        },
        include: {
            rentalRequest: true,
        }
    });
    if (payment?.userId !== userId) {
        throw new Error("You are not authorized to view this payment.");
    }
    return payment;
}

export const paymentService = {
    createPayment,
    handleWebhook,
    getPaymentsByUserId,
    getPaymentDetails
};