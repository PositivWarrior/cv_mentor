"use client";

import { ReactNode, useEffect } from "react";
import { SubscriptionLevel } from "@/lib/subscription";
import SubscriptionLevelProvider from "./SubscriptionLevelProvider";

export default function ClientWrapper({
    children,
    userSubscriptionLevel,
}: {
    children: ReactNode;
    userSubscriptionLevel: SubscriptionLevel;
}) {
    useEffect(() => {
        console.log("Client-side subscription level:", userSubscriptionLevel);
    }, [userSubscriptionLevel]);

    return (
        <SubscriptionLevelProvider
            userSubscriptionLevel={userSubscriptionLevel}
        >
            {children}
        </SubscriptionLevelProvider>
    );
}
