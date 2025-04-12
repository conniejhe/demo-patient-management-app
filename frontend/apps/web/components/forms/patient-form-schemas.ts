import * as z from "zod"
import { StatusEnum, AddressTypeEnum, StateEnum, PatientCustomField } from "@frontend/types/api"

export const addressSchema = z.object({
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

export const patientFormSchema = z.object({
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
})