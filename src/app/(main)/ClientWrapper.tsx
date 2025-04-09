"use client";

import { ReactNode } from "react";
import { SubscriptionLevel } from "@/lib/subscription";
import SubscriptionLevelProvider from "./SubscriptionLevelProvider";

export default function ClientWrapper({
    children,
    userSubscriptionLevel,
}: {
    children: ReactNode;
    userSubscriptionLevel: SubscriptionLevel;
}) {
    return (
        <SubscriptionLevelProvider
            userSubscriptionLevel={userSubscriptionLevel}
        >
            {children}
        </SubscriptionLevelProvider>
    );
}
