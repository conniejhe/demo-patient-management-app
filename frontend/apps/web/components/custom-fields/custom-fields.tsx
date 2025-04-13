'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@frontend/ui/components/dialog"
import { Button } from "@frontend/ui/components/button"
import { Edit } from "lucide-react"
import { PatientCustomField, PatientCustomFieldCreate, FieldTypeEnum } from "@frontend/types/api"
import { useState } from "react"
import { ExistingFieldCard } from "@/components/custom-fields/existing-field-card"
import { NewFieldCard } from "@/components/custom-fields/new-field-card"
import { useToast } from "@frontend/ui/hooks/use-toast"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { createCustomField, deleteCustomField, usePatientApi } from "@/lib/patient-api"

interface CustomFieldsProps {
    fields: PatientCustomField[]
}

const initialNewField: PatientCustomFieldCreate = {
    name: "",
    field_type: FieldTypeEnum.TEXT,
    description: null,
}

export default function CustomFields({ fields }: CustomFieldsProps) {
    const [open, setOpen] = useState(false)
    const [newField, setNewField] = useState<PatientCustomFieldCreate>(initialNewField)
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const { session } = usePatientApi()

    const createMutation = useMutation({
        mutationFn: ({ newField, session }: { newField: PatientCustomFieldCreate, session: any }) => createCustomField(newField, session),
        onSuccess: () => {
            toast({
                title: "Custom Field Created",
            })
            queryClient.invalidateQueries({ queryKey: ['customFields'] })
            setNewField(initialNewField)
        },
        onError: () => {
            toast({
                title: "Failed to create custom field",
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: ({ id, session }: { id: number, session: any }) => deleteCustomField(id, session),
        onSuccess: () => {
            toast({
                title: "Custom Field Deleted",
            })
            queryClient.invalidateQueries({ queryKey: ['customFields'] })
        },
        onError: () => {
            toast({
                title: "Failed to delete custom field",
            })
        },
    })

    const handleFieldChange = (field: Partial<PatientCustomField>) => {
        setNewField({ ...newField, ...field })
    }

    const handleSaveField = () => {
        createMutation.mutate({ newField, session });
    }

    const handleDeleteField = (id: number) => {
        deleteMutation.mutate({ id, session })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Edit />
                    Manage Custom Fields
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Manage Custom Fields</DialogTitle>
                    <DialogDescription>
                        Add or remove custom fields for patient profiles.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-row gap-6 overflow-hidden">
                    <div className="w-1/2 overflow-y-auto pr-4">
                        <h3 className="text-lg font-medium mb-4">Existing Fields</h3>
                        <div className="space-y-4">
                            {fields.map((field) => (
                                <ExistingFieldCard
                                    key={field.id}
                                    field={field}
                                    onDelete={handleDeleteField}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2 border-l pl-6">
                        <h3 className="text-lg font-medium mb-4">Add New Field</h3>
                        <NewFieldCard
                            field={newField}
                            onChange={handleFieldChange}
                            onSave={handleSaveField}
                        />
                    </div>
                </div>
                <DialogFooter className="bottom-0 bg-background pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}