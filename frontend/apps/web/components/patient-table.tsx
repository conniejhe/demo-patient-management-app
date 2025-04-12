'use client'

import { useQuery } from '@tanstack/react-query'
import { getPatients, usePatientApi } from '@/lib/patient-api'
import { PaginatedPatientListList } from '@frontend/types/api'
import { PatientCustomField } from '@frontend/types/api'
import { DataTable } from './data-table-utils/data-table'
import { patientColumns } from './patient-columns'

interface PatientTableProps {
    customFields: PatientCustomField[]
}

export function PatientTable({ customFields }: PatientTableProps) {
    const { session } = usePatientApi()

    const { data, isLoading, isError, error } = useQuery<PaginatedPatientListList>({
        queryKey: ['patients'],
        queryFn: () => {
            return getPatients(session)
        },
        enabled: !!session,
    })
    console.log(data)

    const patientColumnsWithCustomFields = [...patientColumns];
    if (customFields) {
        customFields.forEach((customField) => {
            patientColumnsWithCustomFields.push({
                header: customField.name,
                cell: ({ row }) => {
                    return row.original.custom_field_values.find((field) => field.custom_field === customField.name)?.value
                }
            })
        })
    }

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
        <>
            <DataTable columns={patientColumnsWithCustomFields} data={data?.results || []} />
        </>
    )
}