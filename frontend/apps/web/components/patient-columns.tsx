"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { PatientList, PatientAddressList } from "@frontend/types/api"
import { Badge } from "@frontend/ui/components/badge"
import { StatusEnum } from "@frontend/types/api"
import { Button } from "@frontend/ui/components/button"

export const patientColumns: ColumnDef<PatientList>[] = [
    {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        accessorKey: "full_name",
        cell: ({ row }) => {
            return <div className="min-w-[200px]">{row.original.full_name}</div>
        }
    },
    {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    First Name
                    <ArrowUpDown />
                </Button>
            )
        },
        accessorKey: "first_name",
    },
    {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Middle Name
                    <ArrowUpDown />
                </Button>
            )
        },
        accessorKey: "middle_name",
    },
    {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Name
                    <ArrowUpDown />
                </Button>
            )
        },
        accessorKey: "last_name",
    },
    {
        header: "Date of Birth",
        accessorKey: "date_of_birth",
    },
    {
        header: "Status",
        accessorKey: "status",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
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
        header: "Primary Address",
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