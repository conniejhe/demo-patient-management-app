'use client'

import { Button } from "@frontend/ui/components/button"
import { Input } from "@frontend/ui/components/input"
import { Trash2 } from "lucide-react"
import { Control } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@frontend/ui/components/form"
import { AddressTypeEnum, StateEnum } from "@frontend/types/api"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@frontend/ui/components/select"
import { Checkbox } from "@frontend/ui/components/checkbox"

interface AddressFormProps {
    index: number
    control: Control<any>
    remove: () => void
}

export function AddressForm({ index, control, remove }: AddressFormProps) {
    return (
        <div className="grid gap-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Address {index + 1}</h4>
                {index !== 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={remove}
                    >
                        <Trash2 />
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name={`addresses.${index}.address_type`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(AddressTypeEnum).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.charAt(0) + type.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`addresses.${index}.is_primary`}
                    render={({ field }) => (
                        <FormItem className="flex flex-row space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Primary Address
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={control}
                name={`addresses.${index}.street_address`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Street Address *</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter street address" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={control}
                    name={`addresses.${index}.city`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter city" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`addresses.${index}.state`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(StateEnum).map((state) => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={control}
                name={`addresses.${index}.postal_code`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Postal Code *</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}