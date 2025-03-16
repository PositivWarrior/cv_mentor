import ResumePreview from "@/components/ResumePreview";
import { ResumeValues } from "@/lib/validation";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
}

export default function ResumePreviewSection({
    resumeData,
    setResumeData,
}: ResumePreviewSectionProps) {
    return (
        <div className="group relative hidden h-full w-full md:flex">
            <div className="absolute left-1 top-1 flex flex-none flex-col gap-3 opacity-50 transition-opacity duration-300 group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100">
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
