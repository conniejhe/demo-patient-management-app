'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@frontend/ui/components/alert-dialog"
import { Card, CardContent, CardFooter } from "@frontend/ui/components/card"
import { Input } from "@frontend/ui/components/input"
import { Label } from "@frontend/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@frontend/ui/components/select"
import { Textarea } from "@frontend/ui/components/textarea"
import { Button } from "@frontend/ui/components/button"
import { PatientCustomField } from "@frontend/types/api"
import { Trash2 } from "lucide-react"

interface ExistingFieldCardProps {
    field: PatientCustomField
    onDelete: (id: number) => void
}

export function ExistingFieldCard({ field, onDelete }: ExistingFieldCardProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <form className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Field Name</Label>
                        <Input
                            id="name"
                            value={field.name}
                            disabled
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="field_type">Field Type</Label>
                        <Select
                            value={field.field_type}
                            disabled
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={field.field_type}>
                                    {field.field_type}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={field.description || ""}
                            disabled
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                        >
                            <Trash2 />
                            Delete Field
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this field?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently the custom field and all associated data from the system. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(field.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    )
} 