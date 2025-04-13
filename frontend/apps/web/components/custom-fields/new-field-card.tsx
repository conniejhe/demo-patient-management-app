'use client'

import { Card, CardContent, CardFooter } from "@frontend/ui/components/card"
import { Input } from "@frontend/ui/components/input"
import { Label } from "@frontend/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@frontend/ui/components/select"
import { Textarea } from "@frontend/ui/components/textarea"
import { Button } from "@frontend/ui/components/button"
import { PatientCustomFieldCreate, FieldTypeEnum } from "@frontend/types/api"
import { Save } from "lucide-react"

interface NewFieldCardProps {
    field: PatientCustomFieldCreate
    onChange: (field: Partial<PatientCustomFieldCreate>) => void
    onSave: () => void
}

export function NewFieldCard({ field, onChange, onSave }: NewFieldCardProps) {
    const fieldTypes = [
        { value: FieldTypeEnum.TEXT, label: "Text" },
        { value: FieldTypeEnum.NUMBER, label: "Number" },
    ]

    return (
        <Card>
            <CardContent className="pt-6">
                <form className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Field Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter field name"
                            value={field.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="field_type">Field Type</Label>
                        <Select
                            value={field.field_type}
                            onValueChange={(value: FieldTypeEnum) => onChange({ field_type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select field type" />
                            </SelectTrigger>
                            <SelectContent>
                                {fieldTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter field description"
                            value={field.description || ""}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ description: e.target.value || null })}
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={onSave} disabled={!field.name}>
                    <Save />
                    Create Field
                </Button>
            </CardFooter>
        </Card>
    )
} 