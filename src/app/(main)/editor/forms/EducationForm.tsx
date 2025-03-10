import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorFormProps } from "@/lib/types";
import { educationSchema, EducationValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

export default function EducationForm({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const form = useForm<EducationValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            educations: resumeData.educations || [],
        },
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();

            if (!isValid) return;

            setResumeData({
                ...resumeData,
                educations:
                    values.educations?.filter((edu) => edu !== undefined) || [],
            });
        });

        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "educations",
    });

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Education</h2>
                <p className="text-sm text-muted-foreground">
                    Add as many education as you want
                </p>
            </div>

            <Form {...form}>
                <form className="space-y-3">
                    {fields.map((filed, index) => (
                        <EducationItem
                            key={filed.id}
                            index={index}
                            form={form}
                            remove={remove}
                        />
                    ))}

                    <div className="flex justify-center">
                        <Button
                            type="button"
                            onClick={() =>
                                append({
                                    degree: "",
                                    school: "",
                                    startDate: "",
                                    endDate: "",
                                })
                            }
                        >
                            Add Education
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

interface EducationItemProps {
    form: UseFormReturn<EducationValues>;
    index: number;
    remove: (index: number) => void;
}

function EducationItem({ form, index, remove }: EducationItemProps) {
    return (
        <div className="space-y-3 rounded-md border bg-background p-3">
            <div className="flex justify-between gap-2">
                <span className="font-semibold">Education {index + 1}</span>
                <GripHorizontal className="size-5 cursor-grab text-muted-foreground" />
            </div>

            <FormField
                control={form.control}
                name={`educations.${index}.degree`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                            <Input {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`educations.${index}.school`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>School</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name={`educations.${index}.startDate`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    value={field.value?.slice(0, 10)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`educations.${index}.endDate`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    value={field.value?.slice(0, 10)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <Button
                variant="destructive"
                type="button"
                onClick={() => remove(index)}
            >
                Remove
            </Button>
        </div>
    );
}
