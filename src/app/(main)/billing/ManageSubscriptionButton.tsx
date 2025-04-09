"use client";

import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ManageSubscriptionButton() {
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);

    async function handleClick() {
        try {
        } catch (error) {}
    }

    return (
        <LoadingButton onClick={handleClick} loading={loading}>
            Manage subscription
        </LoadingButton>
    );
}
