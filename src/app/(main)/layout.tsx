import PremiumModal from "@/components/premium/PremiumModal";
import Navbar from "./Navbar";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import ClientWrapper from "./ClientWrapper";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    const userSubscriptionLevel = userId
        ? await getUserSubscriptionLevel(userId)
        : "free";

    return (
        <ClientWrapper userSubscriptionLevel={userSubscriptionLevel}>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                {children}
                <PremiumModal />
            </div>
        </ClientWrapper>
    );
}
