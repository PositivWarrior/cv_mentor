import { env } from "@/env";
import prisma from "./prisma";

export type SubscriptionLevel = "free" | "pro";

export const getUserSubscriptionLevel = async (
    userId: string,
): Promise<SubscriptionLevel> => {
    console.log("Finding subscription for user:", userId);

    try {
        const subscription = await prisma.userSubscription.findUnique({
            where: {
                userId,
            },
        });

        console.log("Found subscription:", subscription);

        if (!subscription) {
            console.log("No subscription found, returning free tier");
            return "free";
        }

        const currentDate = new Date();
        console.log("Current date:", currentDate);
        console.log(
            "Subscription end date:",
            subscription.stripeCurrentPeriodEnd,
        );

        if (subscription.stripeCurrentPeriodEnd < currentDate) {
            console.log("Subscription expired, returning free tier");
            return "free";
        }

        console.log("Checking price ID:", subscription.stripePriceId);
        console.log(
            "Pro price ID:",
            env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
        );
        console.log(
            "Pro Plus price ID:",
            env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
        );

        if (
            subscription.stripePriceId ===
                env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY ||
            subscription.stripePriceId ===
                env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
        ) {
            console.log("Returning pro tier");
            return "pro";
        }

        console.log("Invalid price ID, throwing error");
        throw new Error("Invalid subscription");
    } catch (error) {
        console.error("Error getting subscription level:", error);
        throw error;
    }
};
