import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { canUseAITools } from "@/lib/permissions";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({
                canUseAI: false,
                subscriptionLevel: "free",
            });
        }

        const subscriptionLevel = await getUserSubscriptionLevel(userId);

        return NextResponse.json({
            canUseAI: canUseAITools(subscriptionLevel),
            subscriptionLevel,
        });
    } catch (error) {
        console.error("Subscription check error:", error);
        return NextResponse.json({
            canUseAI: false,
            subscriptionLevel: "free",
            error: "Failed to check subscription",
        });
    }
}
