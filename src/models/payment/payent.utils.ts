import Stripe from "stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import { stripe } from "../../config/stripe";
import { prisma } from "../../lib/prisma";

export const getPeriodEnd = (payload: Stripe.Subscription) => {
    const currentPeriodEndInMilliseconds = payload.items.data[0]?.current_period_end!;

    const currentPeriodEnd = new Date(currentPeriodEndInMilliseconds * 1000);

    return currentPeriodEnd;
}

export const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
    const userId = session.metadata?.userId;
    const rentalRequestId = session.metadata?.rentalRequestId;
    const stripeCustomerId = session.customer as string;
    const stripePaymentId = session.subscription as string;

    if (!userId || !stripeCustomerId || !stripePaymentId || !rentalRequestId) {
        console.log("Missing required metadata in session object");
        return;
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(stripePaymentId);

    const currentPeriodEnd = getPeriodEnd(stripeSubscription);

    await prisma.payment.upsert({
        where: {
            userId: userId
        },
        create: {
            userId,
            rentalRequestId,
            amount: session.amount_total!,
            stripeCustomerId,
            stripePaymentId,
            status: "ACTIVE",
            currentPeriodEnd,
        },
        update: {
            stripeCustomerId,
            stripePaymentId,
            status: "ACTIVE",
            currentPeriodEnd,
        }
    })

    await prisma.rentalRequest.update({
        where: {
            id: rentalRequestId
        },
        data: {
            paymentStatus: "PAID"
        }
    })
}

export const handleChangeSubscription = async (payload: Stripe.Subscription) => {
    const stripePaymentId = payload.id;

    const status = (payload.status === "active" || payload.status === "trialing") ? SubscriptionStatus.ACTIVE : payload.status === "canceled" ? SubscriptionStatus.CANCELLED : SubscriptionStatus.EXPIRED;

    const currentPeriodEnd = getPeriodEnd(payload);

    const isSubscriptionExists = await prisma.payment.findUnique({
        where: {
            stripePaymentId: stripePaymentId
        }
    })

    if (!isSubscriptionExists) {
        console.log("Subscription not found for stripePaymentId:", stripePaymentId);
        return;
    }

    await prisma.payment.update({
        where: {
            stripePaymentId: stripePaymentId
        },
        data: {
            status,
            currentPeriodEnd
        }
    })
}