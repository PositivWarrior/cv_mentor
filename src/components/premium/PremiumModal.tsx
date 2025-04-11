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

// Combine all features into the Pro plan
const proFeatures = ["AI tools", "Unlimited resumes", "Customizations"];

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
                    <div className="flex justify-center">
                        <div className="flex w-3/4 flex-col space-y-5">
                            <h3 className="bg-gradient-to-r from-blue-600 to-purple-400 bg-clip-text text-center text-xl font-bold text-transparent">
                                Pro
                            </h3>
                            <ul className="list-inside space-y-2 px-4">
                                {proFeatures.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-center gap-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-4 text-green-500"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant="premium"
                                onClick={() =>
                                    handlePremiumClick(
                                        env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
                                    )
                                }
                                disabled={loading}
                                className="mx-auto w-3/4"
                            >
                                Get Pro
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
