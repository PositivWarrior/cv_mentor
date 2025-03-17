"use server";

import prisma from "@/lib/prisma";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import { pathToFileURL } from "url";

export async function saveResume(values: ResumeValues) {
    const { id } = values;

    console.log("Received values:", values);

    const { photo, workExperiences, educations, ...resumeValues } =
        resumeSchema.parse(values);

    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // TODO: Check resume count for non premium users

    const existingResume = id
        ? await prisma.resume.findUnique({ where: { id, userId } })
        : null;

    if (id && !existingResume) {
        throw new Error("Resume not found");
    }

    let newPhotoUrl: string | undefined | null = undefined;

    if (photo instanceof File) {
        if (existingResume?.photoUrl) {
            await del(existingResume.photoUrl);
        }

        const blob = await put(
            `resume_photos/${pathToFileURL.extname(photo.name)}`,
            photo,
            {
                access: "public",
            },
        );

        newPhotoUrl = blob.url;
    } else if (photo === null) {
        if (existingResume?.photoUrl) {
            await del(existingResume.photoUrl);
        }

        newPhotoUrl = null;
    }

    if (id) {
        return await prisma.resume.update({
            where: { id },
            data: {
                ...resumeValues,
                photoUrl: newPhotoUrl,
                workExperiences: {
                    deleteMany: {},
                    create: workExperiences?.map((exp) => ({
                        ...exp,
                        startDate: exp.startDate
                            ? new Date(exp.startDate)
                            : undefined,
                        endDate: exp.endDate
                            ? new Date(exp.endDate)
                            : undefined,
                    })),
                },
                educations: {
                    deleteMany: {},
                    create: educations?.map((edu) => ({
                        ...edu,
                        startDate: edu.startDate
                            ? new Date(edu.startDate)
                            : undefined,
                        endDate: edu.endDate
                            ? new Date(edu.endDate)
                            : undefined,
                    })),
                },
                updatedAt: new Date(),
            },
        });
    } else {
        return await prisma.resume.create({
            data: {
                ...resumeValues,
                userId,
                photoUrl: newPhotoUrl,
                workExperiences: {
                    create: workExperiences?.map((exp) => ({
                        ...exp,
                        startDate: exp.startDate
                            ? new Date(exp.startDate)
                            : undefined,
                        endDate: exp.endDate
                            ? new Date(exp.endDate)
                            : undefined,
                    })),
                },
                educations: {
                    create: educations?.map((edu) => ({
                        ...edu,
                        startDate: edu.startDate
                            ? new Date(edu.startDate)
                            : undefined,
                        endDate: edu.endDate
                            ? new Date(edu.endDate)
                            : undefined,
                    })),
                },
            },
        });
    }
}
