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
import { useForm, useFieldArray } from "react-hook-form"
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

const addressSchema = z.object({
    address_type: z.nativeEnum(AddressTypeEnum, {
        required_error: "Please select an address type.",
    }),
    street_address: z.string().min(1, {
        message: "Street address is required.",
    }),
    city: z.string().min(1, {
        message: "City is required.",
    }),
    state: z.nativeEnum(StateEnum, {
        required_error: "Please select a state.",
    }),
    postal_code: z.string().min(1, {
        message: "Postal code is required.",
    }),
    is_primary: z.boolean().default(false),
})

// Create a dynamic schema based on custom fields
const createFormSchema = (customFields: PatientCustomField[]) => {
    return z.object({
        first_name: z.string().min(2, {
            message: "First name is required and must be at least 2 characters.",
        }),
        middle_name: z.string().optional(),
        last_name: z.string().min(2, {
            message: "Last name is required and must be at least 2 characters.",
        }),
        date_of_birth: z.date({
            required_error: "Date of birth is required.",
        }),
        status: z.nativeEnum(StatusEnum, {
            required_error: "Please select a status.",
        }),
        addresses: z.array(addressSchema).min(1, {
            message: "At least one address is required.",
        }),
        custom_fields: z.record(z.string(), z.union([z.string(), z.number(), z.null()]).optional()).optional(),
    });
};

interface RegisterPatientFormProps {
    customFields: PatientCustomField[]
}

export function RegisterPatientForm({ customFields }: RegisterPatientFormProps) {
    const formSchema = createFormSchema(customFields);
    type FormValues = z.infer<typeof formSchema>;
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
        resolver: zodResolver(formSchema),
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

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "addresses",
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

                            if (customField.field_type === 'NUMBER') {
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
                title: "Patient created",
                description: "The patient has been successfully created.",
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
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
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
                                control={form.control}
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
                                control={form.control}
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
                                control={form.control}
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
                                control={form.control}
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
                                    control={form.control}
                                    remove={() => remove(index)}
                                />
                            ))}
                        </div>

                        {/* Custom Fields Section */}
                        {customFields.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Custom Fields</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {customFields.map((customField) => (
                                        <FormField
                                            key={customField.id}
                                            control={form.control}
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
                        )}

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
