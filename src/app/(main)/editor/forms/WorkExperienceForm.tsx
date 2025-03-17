import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { workExperienceSchema, WorkExperienceValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export default function WorkExperienceForm({
    resumeData,
    setResumeData,
}: EditorFormProps) {
    const form = useForm<WorkExperienceValues>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            workExperiences: resumeData.workExperiences || [],
        },
    });

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();

            if (!isValid) return;

            setResumeData({
                ...resumeData,
                workExperiences:
                    values.workExperiences?.filter(
                        (exp) => exp !== undefined,
                    ) || [],
            });
        });

        return unsubscribe;
    }, [form, resumeData, setResumeData]);

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "workExperiences",
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex(
                (field) => field.id === active.id,
            );
            const newIndex = fields.findIndex((field) => field.id === over.id);

            move(oldIndex, newIndex);

            return arrayMove(fields, oldIndex, newIndex);
        }
    }

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Work Experience</h2>
                <p className="text-sm text-muted-foreground">
                    Add as many work experiences as you want
                </p>
            </div>

            <Form {...form}>
                <form className="space-y-3">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext
                            items={fields}
                            strategy={verticalListSortingStrategy}
                        >
                            {fields.map((filed, index) => (
                                <WorkExperienceItem
                                    id={filed.id}
                                    key={filed.id}
                                    index={index}
                                    form={form}
                                    remove={remove}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    <div className="flex justify-center">
                        <Button
                            type="button"
                            onClick={() =>
                                append({
                                    position: "",
                                    company: "",
                                    startDate: "",
                                    endDate: "",
                                    description: "",
                                })
                            }
                        >
                            Add Work Experience
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

interface WorkExperienceItemProps {
    id: string;
    form: UseFormReturn<WorkExperienceValues>;
    index: number;
    remove: (index: number) => void;
}

function WorkExperienceItem({
    id,
    form,
    index,
    remove,
}: WorkExperienceItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transition,
        transform,
        isDragging,
    } = useSortable({ id });

    // Date field handling
    const handleDateChange = (
        field: any,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newValue = e.target.value;
        field.onChange(newValue || undefined);
    };

    // Helper function to format dates for input elements
    const formatDateForInput = (dateString?: string) => {
        if (!dateString) return "";
        return dateString;
    };

    return (
        <div
            className={cn(
                "space-y-3 rounded-md border bg-background p-3",
                isDragging && "z-100 relative cursor-grab shadow-xl",
            )}
            ref={setNodeRef}
            style={{
                transition,
                transform: CSS.Transform.toString(transform),
            }}
        >
            <div className="flex justify-between gap-2">
                <span className="font-semibold">
                    Work Experience {index + 1}
                </span>
                <GripHorizontal
                    className="size-5 cursor-grab text-muted-foreground focus:outline-none"
                    {...attributes}
                    {...listeners}
                />
            </div>

            <FormField
                control={form.control}
                name={`workExperiences.${index}.position`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                            <Input {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`workExperiences.${index}.company`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Company</FormLabel>
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
                    name={`workExperiences.${index}.startDate`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    value={formatDateForInput(field.value)}
                                    onChange={(e) => handleDateChange(field, e)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`workExperiences.${index}.endDate`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    value={formatDateForInput(field.value)}
                                    onChange={(e) => handleDateChange(field, e)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormDescription>
                Leave <span className="font-semibold">end date</span> blank if
                you are currently working in this job
            </FormDescription>

            <FormField
                control={form.control}
                name={`workExperiences.${index}.description`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

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
