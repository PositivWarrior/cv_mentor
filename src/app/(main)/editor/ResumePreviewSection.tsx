import ResumePreview from "@/components/ResumePreview";
import { ResumeValues } from "@/lib/validation";

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
}

export default function ResumePreviewSection({
    resumeData,
    setResumeData,
}: ResumePreviewSectionProps) {
    return (
        <div className="h-full w-full">
            <div className="flex h-full w-full items-center justify-center overflow-auto bg-secondary p-6">
                <ResumePreview
                    resumeData={resumeData}
                    className="h-auto max-w-[95%] shadow-md"
                />
            </div>
        </div>
    );
}
