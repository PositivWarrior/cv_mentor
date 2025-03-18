import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";
import prisma from "@/lib/prisma";

interface PageProps {
    searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
    title: "Design your resume",
};

export default async function Page({ searchParams }: PageProps) {
    const { resumeId } = await searchParams;

    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const resumeToEdit = resumeId
        ? await prisma.resume.findUnique({
              where: { id: resumeId, userId },
              include: resumeDataInclude,
          })
        : null;

    return <ResumeEditor resumeToEdit={resumeToEdit} />;
}
