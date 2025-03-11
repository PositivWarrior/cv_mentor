"use client";

import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import { useState } from "react";
import { ResumeValues } from "@/lib/validation";
import ResumePreviewSection from "./ResumePreviewSection";

export default function ResumeEditor() {
    const searchParams = useSearchParams();

    const [resumeData, setResumeData] = useState<ResumeValues>({});

    const currentStep = searchParams.get("step") || steps[0].key;

    function setStep(key: string) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("step", key);
        window.history.pushState(null, "", `?${newSearchParams.toString()}`);
    }

    const FormComponent = steps.find(
        (step) => step.key === currentStep,
    )?.component;

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b px-3 py-5 text-center">
                <h1 className="text-2xl font-bold">Design your resume</h1>
                <p className="text-sm text-muted-foreground">
                    Follow the steps below to create your resume. Your progress
                    will be saved automatically.
                </p>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-full overflow-y-auto border-r p-3 md:w-2/5">
                    <div className="space-y-8">
                        <Breadcrumbs
                            currentStep={currentStep}
                            setCurrentStep={setStep}
                        />
                        {FormComponent && (
                            <div className="pt-2">
                                <FormComponent
                                    resumeData={resumeData}
                                    setResumeData={setResumeData}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="hidden md:block md:w-3/5">
                    <ResumePreviewSection
                        resumeData={resumeData}
                        setResumeData={setResumeData}
                    />
                </div>
            </div>

            <Footer currentStep={currentStep} setCurrentStep={setStep} />
        </div>
    );
}
