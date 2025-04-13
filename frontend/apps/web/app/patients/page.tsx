'use client'

import { PatientTable } from '@/components/patient-table/patient-table'
import { RegisterPatientForm } from '@/components/forms/patient/register-patient-form'
import { useQuery } from '@tanstack/react-query'
import { getCustomFields, usePatientApi } from '@/lib/patient-api'
import { PaginatedPatientCustomFieldList } from '@frontend/types/api'
import CustomFields from '@/components/custom-fields/custom-fields'

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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Patient Dashboard</h1>
                <div className="flex items-center gap-4">
                    <RegisterPatientForm customFields={customFields?.results || []} />
                    <CustomFields fields={customFields?.results || []} />
                </div>
            </div>
            <PatientTable customFields={customFields?.results || []} />
        </div>
    )
} 