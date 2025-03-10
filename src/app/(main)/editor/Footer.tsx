import { Button } from "@/components/ui/button";
import Link from "next/link";
import { steps } from "./steps";

interface FooterProps {
    currentStep: string;
    setCurrentStep: (step: string) => void;
}

export default function Footer({ currentStep, setCurrentStep }: FooterProps) {
    const currentStepIndex = steps.findIndex(
        (step) => step.key === currentStep,
    );

    const previousStep =
        currentStepIndex > 0 ? steps[currentStepIndex - 1].key : undefined;

    const nextStep =
        currentStepIndex < steps.length - 1
            ? steps[currentStepIndex + 1].key
            : undefined;

    return (
        <footer className="sticky bottom-0 border-t bg-background px-3 py-5 shadow-sm">
            <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={
                            previousStep
                                ? () => setCurrentStep(previousStep)
                                : undefined
                        }
                        disabled={!previousStep}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={
                            nextStep
                                ? () => setCurrentStep(nextStep)
                                : undefined
                        }
                        disabled={!nextStep}
                    >
                        Next
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="secondary" asChild>
                        <Link href="/resumes">Close</Link>
                    </Button>
                    <p className="text-muted-foreground opacity-0">Saving...</p>
                </div>
            </div>
        </footer>
    );
}
