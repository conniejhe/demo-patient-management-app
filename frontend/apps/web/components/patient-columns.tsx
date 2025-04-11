"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PatientList, PatientAddressList } from "@frontend/types/api"
import { Badge } from "@frontend/ui/components/badge"
import { StatusEnum } from "@frontend/types/api"


export const patientColumns: ColumnDef<PatientList>[] = [
    {
        header: "Name",
        accessorKey: "full_name",
    },
    {
        header: "First Name",
        accessorKey: "first_name",
    },
    {
        header: "Middle Name",
        accessorKey: "middle_name",
    },
    {
        header: "Last Name",
        accessorKey: "last_name",
    },
    {
        header: "Date of Birth",
        accessorKey: "date_of_birth",
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
            const status = row.original.status
            const variantMap: Record<StatusEnum, "success" | "warning" | "error" | "info"> = {
                [StatusEnum.ACTIVE]: "success",
                [StatusEnum.INQUIRY]: "warning",
                [StatusEnum.CHURNED]: "error",
                [StatusEnum.ONBOARDING]: "info"
            }
            return <Badge variant={status ? variantMap[status] : "secondary"}>{status}</Badge>
        }
    },
    {
        header: "Address",
        cell: ({ row }) => {
            const addresses = row.original.addresses
            const primaryAddress = addresses.find((address: PatientAddressList) => address.is_primary)
            return primaryAddress?.full_address
        }
    },
    {
        header: "Created At",
        accessorKey: "created_at",
        cell: ({ row }) => {
            const createdAt = row.original.created_at
            return new Date(createdAt).toLocaleString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    },
]