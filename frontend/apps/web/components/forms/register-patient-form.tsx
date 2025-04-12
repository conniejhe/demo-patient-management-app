'use client'

import { Button } from "@frontend/ui/components/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@frontend/ui/components/dialog"
import { Input } from "@frontend/ui/components/input"
import { UserPlus, Plus } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray, Control } from "react-hook-form"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@frontend/ui/components/form"
import { StatusEnum, AddressTypeEnum, StateEnum, PatientCustomField, FieldTypeEnum, PatientCustomFieldValueCreate, PatientCreate } from "@frontend/types/api"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@frontend/ui/components/select"
import { Calendar } from "@frontend/ui/components/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@frontend/ui/components/popover"
import { cn } from "@frontend/ui/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { AddressForm } from "./address-form"
import { createPatient, usePatientApi } from "@/lib/patient-api"
import { useState } from "react"
import { useToast } from "@frontend/ui/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { patientFormSchema } from "./patient-form-schemas"

interface RegisterPatientFormProps {
    customFields: PatientCustomField[]
}

type FormValues = z.infer<typeof patientFormSchema>;

export function RegisterPatientForm({ customFields }: RegisterPatientFormProps) {
    const { session } = usePatientApi();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    // Initialize custom fields with empty values
    const initialCustomFields: Record<string, string | number | null> = {};
    customFields.forEach(field => {
        if (field.field_type === FieldTypeEnum.NUMBER) {
            initialCustomFields[field.name] = null;
        } else {
            initialCustomFields[field.name] = '';
        }
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            status: StatusEnum.INQUIRY,
            addresses: [{
                address_type: AddressTypeEnum.HOME,
                street_address: "",
                city: "",
                state: StateEnum.CA,
                postal_code: "",
                is_primary: true,
            }],
            custom_fields: initialCustomFields,
        },
    })

    async function onSubmit(values: FormValues) {
        try {
            setIsSubmitting(true);
            // Process custom fields
            const customFieldValues: PatientCustomFieldValueCreate[] = []

            if (values.custom_fields) {
                Object.entries(values.custom_fields).forEach(([fieldName, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        const customField = customFields.find(field => field.name === fieldName)
                        if (customField) {
                            const fieldValue: PatientCustomFieldValueCreate = {
                                custom_field: customField.id,
                                text_value: null,
                                number_value: null
                            }

                            if (customField.field_type === FieldTypeEnum.NUMBER) {
                                fieldValue.number_value = value.toString()
                            } else {
                                fieldValue.text_value = value.toString()
                            }

                            customFieldValues.push(fieldValue)
                        }
                    }
                })
            }

            const newPatient: PatientCreate = {
                ...values,
                date_of_birth: format(values.date_of_birth, 'yyyy-MM-dd'),
                custom_field_values: customFieldValues
            }
            await createPatient(newPatient, session);

            // Show success message
            toast({
                title: "New Patient Created",
                description: "The patient has been successfully registered in the system.",
            });
            form.reset();

            // Close the dialog
            setOpen(false);

            // Invalidate the patients query to refresh the table
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        } catch (error) {
            console.error('Error creating patient:', error);

            // Show error message
            toast({
                title: "Error creating patient",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Patient
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Create new patient profile</DialogTitle>
                    <DialogDescription>
                        Register a new patient. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto pr-6">
                        <PersonalInfoSection control={form.control} />
                        <AddressesSection control={form.control} />
                        <CustomFieldsSection
                            control={form.control}
                            customFields={customFields}
                        />
                        <DialogFooter className="sticky bottom-0 bg-background pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

// Personal Info Section Component
function PersonalInfoSection({ control }: { control: Control<FormValues> }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter first name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="middle_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter middle name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter last name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name="date_of_birth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, 'yyyy-MM-dd')
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(StatusEnum).map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status.charAt(0) + status.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}

// Addresses Section Component
function AddressesSection({ control }: {
    control: Control<FormValues>
}) {
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: "addresses",
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Addresses</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({
                        address_type: AddressTypeEnum.HOME,
                        street_address: "",
                        city: "",
                        state: StateEnum.CA,
                        postal_code: "",
                        is_primary: false,
                    })}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Address
                </Button>
            </div>
            {fields.map((field, index) => (
                <AddressForm
                    key={field.id}
                    index={index}
                    control={control}
                    remove={() => remove(index)}
                />
            ))}
        </div>
    )
}

// Custom Fields Section Component
function CustomFieldsSection({ control, customFields }: {
    control: Control<FormValues>,
    customFields: PatientCustomField[]
}) {
    if (customFields.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Custom Fields</h3>
            <div className="grid grid-cols-2 gap-4">
                {customFields.map((customField) => (
                    <FormField
                        key={customField.id}
                        control={control}
                        name={`custom_fields.${customField.name}`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{customField.name}</FormLabel>
                                <FormControl>
                                    <Input
                                        type={customField.field_type === FieldTypeEnum.NUMBER ? "number" : "text"}
                                        placeholder={`Enter ${customField.name.toLowerCase()}`}
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
