'use client'

import { Button } from "@frontend/ui/components/button"
import { Input } from "@frontend/ui/components/input"
import { Plus } from "lucide-react"
import { useFieldArray, Control } from "react-hook-form"
import * as z from "zod"

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@frontend/ui/components/form"
import { StatusEnum, AddressTypeEnum, StateEnum, PatientCustomField, FieldTypeEnum } from "@frontend/types/api"
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
import { patientFormSchema } from "./patient-form-schemas"

type FormValues = z.infer<typeof patientFormSchema>;

// Personal Info Section Component
export function PersonalInfoSection({ control }: { control: Control<FormValues> }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
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
export function AddressesSection({ control }: {
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
export function CustomFieldsSection({ control, customFields }: {
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