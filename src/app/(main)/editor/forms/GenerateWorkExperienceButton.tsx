import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAITools } from "@/lib/permissions";
import {
    GenerateWorkExperienceInput,
    generateWorkExperienceSchema,
    WorkExperience,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSubscriptionLevel } from "../../SubscriptionLevelProvider";
import { generateWorkExperience } from "./actions";

interface GenerateWorkExperienceButtonProps {
    onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

export default function GenerateWorkExperienceButton({
    onWorkExperienceGenerated,
}: GenerateWorkExperienceButtonProps) {
    const subscriptionLevel = useSubscriptionLevel();
    const { toast } = useToast();
    const premiumModal = usePremiumModal();
    const [showInputDialog, setShowInputDialog] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Debug the current subscription level
    useEffect(() => {
        console.log(
            "GenerateWorkExperienceButton subscription level:",
            subscriptionLevel,
        );
    }, [subscriptionLevel]);

    const refreshSubscription = async () => {
        try {
            setRefreshing(true);
            const response = await fetch("/refresh-subscription");
            if (!response.ok) {
                throw new Error("Failed to refresh subscription");
            }

            // Force hard reload to update client state
            window.location.reload();
        } catch (error) {
            console.error("Error refreshing subscription:", error);
            toast({
                variant: "destructive",
                description: "Failed to refresh subscription status",
            });
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                type="button"
                onClick={async () => {
                    console.log(
                        "Button clicked, subscription level:",
                        subscriptionLevel,
                    );

                    if (!canUseAITools(subscriptionLevel)) {
                        console.log(
                            "Cannot use AI tools, showing premium modal",
                        );

                        // Try refreshing subscription first
                        if (refreshing) return;

                        try {
                            await fetch("/billing/troubleshoot");
                            await new Promise((resolve) =>
                                setTimeout(resolve, 500),
                            );

                            // Check if we have a pro subscription after refresh
                            const response = await fetch(
                                "/api/subscription-check",
                            );
                            const data = await response.json();

                            if (data.canUseAI) {
                                setShowInputDialog(true);
                                return;
                            }
                        } catch (error) {
                            console.error(
                                "Failed to refresh subscription:",
                                error,
                            );
                        }

                        premiumModal.setOpen(true);
                        return;
                    }

                    setShowInputDialog(true);
                }}
            >
                <WandSparklesIcon className="size-4" />
                Smart fill (AI)
            </Button>
            <InputDialog
                open={showInputDialog}
                onOpenChange={setShowInputDialog}
                onWorkExperienceGenerated={(workExperience) => {
                    onWorkExperienceGenerated(workExperience);
                    setShowInputDialog(false);
                }}
            />
        </>
    );
}

interface InputDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

function InputDialog({
    open,
    onOpenChange,
    onWorkExperienceGenerated,
}: InputDialogProps) {
    const { toast } = useToast();

    const form = useForm<GenerateWorkExperienceInput>({
        resolver: zodResolver(generateWorkExperienceSchema),
        defaultValues: {
            description: "",
        },
    });

    async function onSubmit(input: GenerateWorkExperienceInput) {
        try {
            const response = await generateWorkExperience(input);
            onWorkExperienceGenerated(response);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again.",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate work experience</DialogTitle>
                    <DialogDescription>
                        Describe this work experience and the AI will generate
                        an optimized entry for you.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder={`E.g. "from nov 2019 to dec 2020 I worked at google as a software engineer, my tasks were: ..."`}
                                            autoFocus
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <LoadingButton
                            type="submit"
                            loading={form.formState.isSubmitting}
                        >
                            Generate
                        </LoadingButton>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
