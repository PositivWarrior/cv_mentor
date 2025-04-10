import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
    try {
        // Force revalidation of the entire app
        revalidatePath("/(main)", "layout");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Refresh error:", error);
        return NextResponse.json(
            { error: "Failed to refresh application state" },
            { status: 500 },
        );
    }
}
