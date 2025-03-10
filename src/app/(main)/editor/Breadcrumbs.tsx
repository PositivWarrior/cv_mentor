import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { steps } from "./steps";

interface BreadcrumbProps {
    currentStep: string;
    setCurrentStep: (step: string) => void;
}

export default function Breadcrumbs({
    currentStep,
    setCurrentStep,
}: BreadcrumbProps) {
    return (
        <div className="flex justify-center">
            <Breadcrumb>
                <BreadcrumbList>
                    {steps.map((step, index) => (
                        <React.Fragment key={step.key}>
                            <BreadcrumbItem>
                                {step.key === currentStep ? (
                                    <BreadcrumbPage>
                                        {step.title}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <button
                                            onClick={() =>
                                                setCurrentStep(step.key)
                                            }
                                        >
                                            {step.title}
                                        </button>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {index < steps.length - 1 && (
                                <BreadcrumbSeparator className="last:hidden" />
                            )}
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
