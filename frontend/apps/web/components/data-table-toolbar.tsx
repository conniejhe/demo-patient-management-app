"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@frontend/ui/components/button"
import { Input } from "@frontend/ui/components/input"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    const statuses = [
        { label: "Active", value: "ACTIVE" },
        { label: "Inquiry", value: "INQUIRY" },
        { label: "Onboarding", value: "ONBOARDING" },
        { label: "Churned", value: "CHURNED" },
    ]

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter by name ..."
                    value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("full_name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statuses}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X />
                    </Button>
                )}
            </div>
        </div>
    )
}