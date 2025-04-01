import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    GenerateWorkExperienceInput,
    generateWorkExperienceSchema,
    WorkExperience,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { generateWorkExperience } from "./actions";
import { useState } from "react";
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
import LoadingButton from "@/components/LoadingButton";

interface GenerateWorkExperienceButtonProps {
    onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

export function GenerateWorkExperienceButton({
    onWorkExperienceGenerated,
}: GenerateWorkExperienceButtonProps) {
    const [showInputDialog, setShowInputDialog] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                type="button"
                onClick={() => setShowInputDialog(true)}
                // TODO: Block for non-premium users
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
                description: "Failed to generate work experience",
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Work Experience</DialogTitle>
                    <DialogDescription>
                        Describe your work experience and AI will generate entry
                        for you
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
                                            placeholder="e.g. I worked at Google as a software engineer from nov 2018 to dec 2022, task were..."
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
