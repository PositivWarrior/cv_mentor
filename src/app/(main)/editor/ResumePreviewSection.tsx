import ResumePreview from "@/components/ResumePreview";
import { ResumeValues } from "@/lib/validation";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import { cn } from "@/lib/utils";

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    className?: string;
}

export default function ResumePreviewSection({
    resumeData,
    setResumeData,
    className,
}: ResumePreviewSectionProps) {
    return (
        <div className={cn("group relative h-full w-full", className)}>
            <div className="absolute left-1 top-1 z-10 flex flex-none flex-col gap-3 opacity-50 transition-opacity duration-300 group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100">
                <ColorPicker
                    color={resumeData.colorHex}
                    onChange={(color) =>
                        setResumeData({ ...resumeData, colorHex: color.hex })
                    }
                />

                <BorderStyleButton
                    borderStyle={resumeData.borderStyle}
                    onChange={(borderStyle) =>
                        setResumeData({ ...resumeData, borderStyle })
                    }
                />
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
