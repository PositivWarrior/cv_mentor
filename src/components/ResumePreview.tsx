import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";

interface ResumePreviewProps {
    resumeData: ResumeValues;
    className?: string;
}

export default function ResumePreview({
    resumeData,
    className,
}: ResumePreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { width } = useDimensions(containerRef);

    return (
        <div
            className={cn(
                "aspect-[210/297] h-fit w-full bg-white text-black",
                className,
            )}
            ref={containerRef}
        >
            <div
                className={cn("space-y-6 p-6", !width && "invisible")}
                style={{
                    zoom: (1 / 794) * width,
                }}
            >
                <PersonalInfoHeader resumeData={resumeData} />
                <SummarySection resumeData={resumeData} />
                <WorkExperienceSection resumeData={resumeData} />
            </div>
        </div>
    );
}

interface ResumeSectionProps {
    resumeData: ResumeValues;
}

function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
    const {
        photo,
        firstName,
        lastName,
        jobTitle,
        city,
        country,
        phone,
        email,
    } = resumeData;

    const [photoSrc, setPhotoSrc] = useState(
        photo instanceof File ? "" : photo,
    );

    useEffect(() => {
        const objectUrl =
            photo instanceof File ? URL.createObjectURL(photo) : "";
        if (objectUrl) setPhotoSrc(objectUrl);
        if (photo === null) setPhotoSrc("");

        return () => URL.revokeObjectURL(objectUrl);
    }, [photo]);

    return (
        <div className="flex items-center gap-6">
            {photoSrc && (
                <Image
                    src={photoSrc}
                    alt="Author Photo"
                    width={100}
                    height={100}
                    className="aspect-square object-cover"
                />
            )}

            <div className="space-y-2.5">
                <div className="space-y-1">
                    <p className="text-3xl font-bold">
                        {firstName} {lastName}
                    </p>
                    {jobTitle && <p className="font-medium">{jobTitle}</p>}
                </div>

                {(city || country || phone || email) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {(city || country) && (
                            <p>
                                {city}
                                {city && country && ", "}
                                {country}
                            </p>
                        )}
                        {phone && <p>{phone}</p>}
                        {email && <p>{email}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
    const { summary } = resumeData;

    if (!summary) return null;

    return (
        <>
            <hr className="border-2" />
            <div className="break-inside-avoid space-y-3">
                <p className="text-lg font-semibold">Professional Profile</p>
                <div className="whitespace-pre-line text-sm">{summary}</div>
            </div>
        </>
    );
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
    const { workExperiences } = resumeData;

    const workExperiencesNotEmpty = workExperiences?.filter(
        (exp) => Object.values(exp).filter(Boolean).length > 0,
    );

    if (!workExperiencesNotEmpty?.length) return null;

    return (
        <>
            <hr className="border-2" />
            <div className="space-y-3">
                <p className="text-lg font-semibold">Work Experience</p>
                {workExperiencesNotEmpty.map((exp, index) => (
                    <div key={index} className="break-inside-avoid space-y-1">
                        <div className="flex items-center justify-between text-sm font-semibold">
                            <span>{exp.position}</span>
                            {exp.startDate && (
                                <span>
                                    {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                                    {exp.endDate
                                        ? formatDate(exp.endDate, "MM/yyyy")
                                        : "Present"}
                                </span>
                            )}
                        </div>

                        <p className="text-xs font-semibold">{exp.company}</p>
                        <div className="whitespace-pre-line text-xs">
                            {exp.description}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
