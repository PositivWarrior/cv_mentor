import { env } from "@/env";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return new Response("No signature", { status: 400 });
        }

        const event = stripe.webhooks.constructEvent(
            payload,
            signature,
            env.STRIPE_WEBHOOK_SECRET,
        );

        console.log(`Received event: ${event.type}`, event.data.object);

        switch (event.type) {
            case "checkout.session.completed":
                await handleSessionCompleted(event.data.object);
                break;
            case "customer.subscription.created":
            case "customer.subscription.updated":
                await handleSubscriptionCreatedOrUpdated(event.data.object.id);
                break;
            case "customer.subscription.deleted":
                await handleSubscriptionDeleted(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
                break;
        }

        return new Response("Webhook processed successfully", { status: 200 });
    } catch (error) {
        console.error("Stripe webhook error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;

    if (!userId) {
        throw new Error("User ID not found in session metadata");
    }

    console.log(
        "Updating user metadata with Stripe customer ID:",
        session.customer,
    );
    await (
        await clerkClient()
    ).users.updateUserMetadata(userId, {
        privateMetadata: {
            stripeCustomerId: session.customer as string,
        },
    });
}

async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    console.log("Processing subscription:", subscription.id);
    console.log("Subscription status:", subscription.status);
    console.log("Subscription user ID:", subscription.metadata.userId);
    console.log("Subscription price ID:", subscription.items.data[0].price.id);

    if (
        subscription.status === "active" ||
        subscription.status === "trialing" ||
        subscription.status === "past_due"
    ) {
        try {
            const result = await prisma.userSubscription.upsert({
                where: {
                    userId: subscription.metadata.userId,
                },
                create: {
                    userId: subscription.metadata.userId,
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(
                        subscription.current_period_end * 1000,
                    ),
                    stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
                },
                update: {
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(
                        subscription.current_period_end * 1000,
                    ),
                    stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
                },
            });
            console.log("Updated subscription in database:", result);
        } catch (error) {
            console.error("Error updating subscription in database:", error);
            throw error;
        }
    } else {
        console.log("Deleting subscription from database - inactive status");
        await prisma.userSubscription.deleteMany({
            where: {
                stripeCustomerId: subscription.customer as string,
            },
        });
    }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log("Deleting subscription:", subscription.id);
    await prisma.userSubscription.deleteMany({
        where: {
            stripeCustomerId: subscription.customer as string,
        },
    });
}
