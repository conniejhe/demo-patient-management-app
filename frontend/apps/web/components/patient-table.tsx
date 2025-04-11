'use client'

import { useQuery } from '@tanstack/react-query'
import { getCustomFields, getPatients, usePatientApi } from '@/lib/patient-api'
import { PaginatedPatientListList } from '@frontend/types/api'
import { PaginatedPatientCustomFieldList } from '@frontend/types/api'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@frontend/ui/components/table"

export function PatientTable() {
    const { session } = usePatientApi()

    const { data, isLoading, isError, error } = useQuery<PaginatedPatientListList>({
        queryKey: ['patients'],
        queryFn: () => {
            console.log('Query function executing')
            return getPatients(session)
        },
        enabled: !!session, // Only run the query if we have a session
    })

    const { data: customFields, isLoading: customFieldsLoading } = useQuery<PaginatedPatientCustomFieldList>({
        queryKey: ['customFields'],
        queryFn: () => {
            console.log('Custom fields query executing with session:', session) // Debug session in custom fields query
            return getCustomFields(session)
        },
        enabled: !!session, // Add enabled condition here too
    })

    console.log(data)
    console.log(customFields)
    if (isLoading) {
        console.log('PatientTable is loading')
        return <div className="p-4 text-center">Loading patients...</div>
    }

    if (isError) {
        console.log('PatientTable has error:', error)
        return (
            <div className="p-4 text-center text-red-500">
                Error loading patients: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
        )
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-medium mb-2">Patient Data</h2>
            <p>Check the console to see the fetched patient data.</p>
        </div>

    )
}