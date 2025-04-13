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
import { Pencil, Loader2 } from "lucide-react"

import {
    Form,
} from "@frontend/ui/components/form"
import { PatientCustomField, PatientList } from "@frontend/types/api"
import { usePatientForm } from "@/lib/usePatientForm"
import { PersonalInfoSection, AddressesSection, CustomFieldsSection } from "./patient-form-sections"
import { useState } from "react"

interface EditPatientFormProps {
    customFields: PatientCustomField[]
    patient: PatientList
}

export function EditPatientForm({ customFields, patient }: EditPatientFormProps) {
    const [open, setOpen] = useState(false)
    const { form, isSubmitting, onSubmit } = usePatientForm({ customFields, mode: "edit", patient });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit patient profile</DialogTitle>
                    <DialogDescription>
                        Edit the patient profile. Click save when you're done.
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
                            <Button type="submit" disabled={isSubmitting} >
                                {isSubmitting && <Loader2 className="animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

