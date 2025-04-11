import { PatientTable } from '@/components/patient-table'

export default function PatientsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Patients</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Add Patient
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <PatientTable />
            </div>
        </div>
    )
} 