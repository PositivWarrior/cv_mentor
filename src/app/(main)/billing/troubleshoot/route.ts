import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { getUserSubscriptionLevel } from "@/lib/subscription";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Get current subscription info
        const currentSubscription = await prisma.userSubscription.findUnique({
            where: { userId },
        });

        // Get user from Clerk
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const stripeCustomerId = user.privateMetadata.stripeCustomerId as
            | string
            | undefined;

        // Get subscription info directly from Stripe
        let stripeSubscription = null;
        if (stripeCustomerId) {
            const subscriptions = await stripe.subscriptions.list({
                customer: stripeCustomerId,
                status: "active",
                limit: 1,
            });

            if (subscriptions.data.length > 0) {
                stripeSubscription = subscriptions.data[0];
            }
        }

        // Update local database if needed
        let updatedSubscription = null;
        if (stripeSubscription) {
            updatedSubscription = await prisma.userSubscription.upsert({
                where: {
                    userId,
                },
                create: {
                    userId,
                    stripeSubscriptionId: stripeSubscription.id,
                    stripeCustomerId: stripeCustomerId as string,
                    stripePriceId: stripeSubscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(
                        stripeSubscription.current_period_end * 1000,
                    ),
                    stripeCancelAtPeriodEnd:
                        stripeSubscription.cancel_at_period_end,
                },
                update: {
                    stripePriceId: stripeSubscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(
                        stripeSubscription.current_period_end * 1000,
                    ),
                    stripeCancelAtPeriodEnd:
                        stripeSubscription.cancel_at_period_end,
                },
            });
        }

        // Get the subscription level after potential updates
        const subscriptionLevel = await getUserSubscriptionLevel(userId);

        return NextResponse.json({
            success: true,
            currentSubscription,
            stripeSubscription,
            updatedSubscription,
            subscriptionLevel,
        });
    } catch (error) {
        console.error("Troubleshooting error:", error);
        return NextResponse.json(
            { error: "Failed to troubleshoot subscription" },
            { status: 500 },
        );
    }
}
