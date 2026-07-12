import config from "../../config";
import { stripe } from "../../config/stripe";
import { prisma } from "../../lib/prisma";

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

const handleWebhook = async (event: any) => {

}

export const paymentService = {
    createPayment,
    handleWebhook,
};