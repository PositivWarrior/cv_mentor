import { SubscriptionLevel } from "./subscription";

export function canCreateResume(
    subscriptionLevel: SubscriptionLevel,
    currentResumeCount: number,
) {
    const maxResumeMap: Record<SubscriptionLevel, number> = {
        free: 1,
        pro: Infinity,
    };

    const maxResumes = maxResumeMap[subscriptionLevel];

    return currentResumeCount < maxResumes;
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel) {
    return subscriptionLevel === "pro";
}

export function canUseCustomizations(subscriptionLevel: SubscriptionLevel) {
    return subscriptionLevel === "pro";
}
