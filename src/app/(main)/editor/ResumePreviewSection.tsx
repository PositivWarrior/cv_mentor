import ResumePreview from "@/components/ResumePreview";
import { ResumeValues } from "@/lib/validation";
import ColorPicker from "./ColorPicker";

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
}

export default function ResumePreviewSection({
    resumeData,
    setResumeData,
}: ResumePreviewSectionProps) {
    return (
        <div className="relative h-full w-full">
            <div>
                <ColorPicker />
            </div>
            <div className="flex h-full w-full items-center justify-center overflow-auto bg-secondary p-6">
                <ResumePreview
                    resumeData={resumeData}
                    className="w-full max-w-[650px] shadow-md"
                />
            </div>
        </div>
    );
}
