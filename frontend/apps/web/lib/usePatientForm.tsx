'use client'

import { createPatient, updatePatient, usePatientApi } from "@/lib/patient-api"
import { useState } from "react"
import { useToast } from "@frontend/ui/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { patientFormSchema } from "@/lib/patient-form-schemas"
import { StatusEnum, AddressTypeEnum, StateEnum, PatientCustomField, FieldTypeEnum, PatientCustomFieldValueCreate, PatientCreate, PatientList } from "@frontend/types/api"
import { format } from "date-fns"

import * as z from "zod"

type FormValues = z.infer<typeof patientFormSchema>;

interface UsePatientFormProps {
    customFields: PatientCustomField[]
    mode: "create" | "edit",
    patient?: PatientList
}

const FORM_DEFAULT_VALUES: FormValues = {
    first_name: "",
    middle_name: "",
    date_of_birth: new Date(),
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
}

function getInitialValuesFromPatient(patient: PatientList) {
    return {
        ...patient,
        date_of_birth: new Date(patient.date_of_birth),
        middle_name: patient.middle_name || "",
    }
}
// Custom hook for patient form logic
export function usePatientForm({ customFields, mode, patient }: UsePatientFormProps) {
    const { session } = usePatientApi();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize custom fields with empty values
    const initialCustomFields: Record<string, string | number | null> = {};
    customFields.forEach(field => {
        initialCustomFields[field.name] = field.field_type === FieldTypeEnum.NUMBER ? null : '';
        if (mode === "edit" && patient?.custom_field_values) {
            const existingValue = patient.custom_field_values.find(
                (value) => value.custom_field == field.name
            );

            if (existingValue) {
                initialCustomFields[field.name] = existingValue.value;
            }
        }
    });
    let initialValues = FORM_DEFAULT_VALUES;
    if (mode === "edit" && patient) {
        initialValues = getInitialValuesFromPatient(patient);
    }

    const form = useForm<FormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues: {
            ...initialValues,
            custom_fields: initialCustomFields,
        },
    });

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

            const patientData: PatientCreate = {
                ...values,
                date_of_birth: format(values.date_of_birth, 'yyyy-MM-dd'),
                custom_field_values: customFieldValues
            }

            if (mode === "edit" && patient) {
                await updatePatient(patient.id, patientData, session);
                toast({
                    title: "Patient Updated",
                    description: "The patient has been successfully updated.",
                });
            } else {
                await createPatient(patientData, session);
                toast({
                    title: "New Patient Created",
                    description: "The patient has been successfully registered in the system.",
                });
            }
            form.reset();
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

    return {
        form,
        isSubmitting,
        onSubmit
    };
}