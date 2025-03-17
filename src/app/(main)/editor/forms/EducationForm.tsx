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

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "educations",
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
                <h2 className="text-2xl font-semibold">Education</h2>
                <p className="text-sm text-muted-foreground">
                    Add as many education as you want
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
                                <EducationItem
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
    id: string;
    form: UseFormReturn<EducationValues>;
    index: number;
    remove: (index: number) => void;
}

function EducationItem({ id, form, index, remove }: EducationItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transition,
        transform,
        isDragging,
    } = useSortable({ id });

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
                <span className="font-semibold">Education {index + 1}</span>
                <GripHorizontal
                    className="size-5 cursor-grab text-muted-foreground focus:outline-none"
                    {...attributes}
                    {...listeners}
                />
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
                    name={`educations.${index}.endDate`}
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
