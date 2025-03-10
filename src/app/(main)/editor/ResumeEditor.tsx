"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import Breadcrumbs from "./Breadcrumbs";

export default function ResumeEditor() {
    const searchParams = useSearchParams();

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
        <div className="flex grow flex-col">
            <header className="space-y-1.5 border-b px-3 py-5 text-center">
                <h1 className="text-2xl font-bold">Design your resume</h1>
                <p className="text-sm text-muted-foreground">
                    Follow the steps below to create your resume. Your progress
                    will be saved automatically.
                </p>
            </header>

            <main className="relative grow">
                <div className="absolute bottom-0 top-0 flex w-full flex-row">
                    <div className="w-full space-y-6 overflow-y-auto border-r p-3 md:w-1/2">
                        <Breadcrumbs
                            currentStep={currentStep}
                            setCurrentStep={setStep}
                        />
                        {FormComponent && <FormComponent />}
                    </div>
                    <div className="hidden w-1/2 md:block">RIGHT</div>
                </div>
            </main>

            <footer className="w-full border-t px-3 py-5">
                <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Button variant="secondary">Back</Button>
                        <Button>Next</Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="secondary" asChild>
                            <Link href="/resumes">Close</Link>
                        </Button>
                        <p className="text-muted-foreground opacity-0">
                            Saving...
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
