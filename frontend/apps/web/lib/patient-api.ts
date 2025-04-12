import { getApiClient } from './api'
import { useSession } from 'next-auth/react'
import { PaginatedPatientListList } from '@frontend/types/api/models/PaginatedPatientListList'
import { PaginatedPatientCustomFieldList, PatientCreate, PatientCustomFieldValueCreate } from '@frontend/types/api'

export async function getPatients(session?: any): Promise<PaginatedPatientListList> {
  try {
    const api = await getApiClient(session)
    const response = await api.patients.patientsList()
    return response

  } catch (error) {
    console.error('Error fetching patients:', error)
    throw error
  }
}

export async function getCustomFields(session?: any): Promise<PaginatedPatientCustomFieldList> {
  try {
    const api = await getApiClient(session)
    const response = await api.customFields.customFieldsList()
    return response
  } catch (error) {
    console.error('Error fetching custom fields:', error)
    throw error
  }
}

export async function createPatient(
  patientData: PatientCreate,
  session?: any
): Promise<any> {
  try {
    const api = await getApiClient(session)
    
    const response = await api.patients.patientsCreate(patientData)
    return response
  } catch (error) {
    console.error('Error creating patient:', error)
    throw error
  }
}

export function usePatientApi() {
  const { data: session } = useSession()
  return { session }
} 