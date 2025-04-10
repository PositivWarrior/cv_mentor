"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { createCheckoutSession } from "./actions";
import { env } from "@/env";
import { useSubscriptionLevel } from "@/app/(main)/SubscriptionLevelProvider";
import { Label } from "../ui/label";

const premiumFeatures = ["AI tools", "Up to 3 resumes"];
const premiumPlusFeatures = [
    ...premiumFeatures,
    "Unlimited resumes",
    "Customizations",
];

export default function PremiumModal() {
    const { open, setOpen } = usePremiumModal();
    const subscriptionLevel = useSubscriptionLevel();

    const { toast } = useToast();

    const [loading, setLoading] = useState(false);

    // Debug when the modal is opened
    useEffect(() => {
        if (open) {
            console.log(
                "Premium modal opened with subscription level:",
                subscriptionLevel,
            );
        }
    }, [open, subscriptionLevel]);

    async function handlePremiumClick(priceId: string) {
        try {
            setLoading(true);
            const redirectUrl = await createCheckoutSession(priceId);
            window.location.href = redirectUrl;
        } catch (error) {
            console.error(error);
            toast({
                description: "Something went wrong. Please try again later",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function refreshSubscriptionStatus() {
        try {
            setLoading(true);

            // Force refresh from server
            await fetch("/billing/troubleshoot");

            // Wait a moment for database updates
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Check current status
            const response = await fetch("/api/subscription-check");
            const data = await response.json();

            if (data.canUseAI) {
                toast({
                    title: "Subscription active!",
                    description: "Your premium features are now available",
                });
                setOpen(false);

                // Force page reload to refresh state
                window.location.reload();
            } else {
                toast({
                    title: "Subscription not found",
                    description: "Please try again or contact support",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Failed to refresh subscription:", error);
            toast({
                title: "Error refreshing subscription",
                description: "Please try again or contact support",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!loading) {
                    setOpen(value);
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upgrade to Pro</DialogTitle>
                    <DialogDescription>
                        Unlock premium features to enhance your resume.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Premium features</Label>
                        <ul className="list-disc pl-5 text-sm">
                            {premiumFeatures.map((feature) => (
                                <li key={feature}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex w-1/2 flex-col space-y-5">
                            <h3 className="text-center text-lg font-bold">
                                Premium
                            </h3>
                            <Button
                                onClick={() =>
                                    handlePremiumClick(
                                        env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
                                    )
                                }
                                disabled={loading}
                            >
                                Get Premium
                            </Button>
                        </div>

                        <div className="mx-6 border-l"></div>

                        <div className="flex w-1/2 flex-col space-y-5">
                            <h3 className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-center text-lg font-bold text-transparent">
                                Premium Plus
                            </h3>
                            <Button
                                variant="premium"
                                onClick={() =>
                                    handlePremiumClick(
                                        env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
                                    )
                                }
                                disabled={loading}
                            >
                                Get Premium Plus
                            </Button>
                        </div>
                    </div>
                    <div className="py-2 text-center">
                        <Button
                            onClick={refreshSubscriptionStatus}
                            variant="outline"
                            disabled={loading}
                        >
                            {loading
                                ? "Checking..."
                                : "Already subscribed? Refresh status"}
                        </Button>
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                        <span>Powered by Stripe.</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
