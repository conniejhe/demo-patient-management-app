'use client'

import { PatientTable } from '@/components/patient-table'
import { RegisterPatientForm } from '@/components/forms/register-patient-form'
import { useQuery } from '@tanstack/react-query'
import { getCustomFields, usePatientApi } from '@/lib/patient-api'
import { PaginatedPatientCustomFieldList } from '@frontend/types/api'

export default function PatientsPage() {
    const { session } = usePatientApi()

    const { data: customFields, isLoading: customFieldsLoading } = useQuery<PaginatedPatientCustomFieldList>({
        queryKey: ['customFields'],
        queryFn: () => {
            return getCustomFields(session)
        },
        enabled: !!session,
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Patient Dashboard</h1>
                <RegisterPatientForm customFields={customFields?.results || []} />
            </div>

            <div className="bg-white rounded-lg shadow">
                <PatientTable customFields={customFields?.results || []} />
            </div>
        </div>
    )
} 