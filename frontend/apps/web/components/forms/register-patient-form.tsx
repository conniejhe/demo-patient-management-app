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
import { UserPlus } from "lucide-react"

import {
    Form,
} from "@frontend/ui/components/form"
import { PatientCustomField } from "@frontend/types/api"
import { usePatientForm } from "@/lib/usePatientForm"
import { PersonalInfoSection, AddressesSection, CustomFieldsSection } from "./patient-form-sections"

interface RegisterPatientFormProps {
    customFields: PatientCustomField[]
}

export function RegisterPatientForm({ customFields }: RegisterPatientFormProps) {
    const { form, isSubmitting, open, setOpen, onSubmit } = usePatientForm({ customFields, mode: "create" });

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

