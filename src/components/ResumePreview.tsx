import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { format, formatDate } from "date-fns";
import { Badge } from "./ui/badge";

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
                "aspect-[210/297] h-auto w-full bg-white text-black",
                className,
            )}
            ref={containerRef}
        >
            <div
                className={cn("space-y-6 p-6", !width && "invisible")}
                style={{
                    zoom: Math.max((1 / 794) * width, 0.7),
                }}
            >
                <PersonalInfoHeader resumeData={resumeData} />
                <SummarySection resumeData={resumeData} />
                <WorkExperienceSection resumeData={resumeData} />
                <EducationSection resumeData={resumeData} />
                <SkillsSection resumeData={resumeData} />
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

function formatMonthYear(dateString?: string) {
    if (!dateString) return "";

    const parts = dateString.split("-");
    // If it's already in YYYY-MM-DD format from HTML input, parse it directly
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const parts = dateString.split("-");
        // Return MM/YYYY format (parts[1] is month, parts[0] is year)
        return `${parts[1]}/${parts[0]}`;
    }

    // Otherwise try standard date parsing
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return format(date, "MM/yyyy");
    } catch (error) {
        return "";
    }
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

function EducationSection({ resumeData }: ResumeSectionProps) {
    const { educations } = resumeData;

    const educationsNotEmpty = educations?.filter(
        (edu) => Object.values(edu).filter(Boolean).length > 0,
    );

    if (!educationsNotEmpty?.length) return null;

    return (
        <>
            <hr className="border-2" />
            <div className="space-y-3">
                <p className="text-lg font-semibold">Education</p>
                {educationsNotEmpty.map((edu, index) => (
                    <div key={index} className="break-inside-avoid space-y-1">
                        <div className="flex items-center justify-between text-sm font-semibold">
                            <span>{edu.degree}</span>
                            {edu.startDate && (
                                <span>
                                    {edu.startDate &&
                                        `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
                                </span>
                            )}
                        </div>

                        <p className="text-xs font-semibold">{edu.school}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
    const { skills } = resumeData;

    if (!skills?.length) return null;

    return (
        <>
            <hr className="2 border" />
            <div className="break-inside-avoid space-y-3">
                <p className="text-lg font-semibold">Skills</p>
                <div className="flex break-inside-avoid flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <Badge
                            key={index}
                            className="rounded-md bg-black text-white hover:bg-black"
                        >
                            {skill}
                        </Badge>
                    ))}
                </div>
            </div>
        </>
    );
}
