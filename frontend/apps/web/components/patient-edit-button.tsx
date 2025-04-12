"use client"

import { PatientList } from "@frontend/types/api"
import { Button } from "@frontend/ui/components/button"

interface PatientEditButtonProps {
    row: PatientList
}

export function PatientEditButton({ row }: PatientEditButtonProps) {
    return <Button variant="outline">Edit</Button>
}