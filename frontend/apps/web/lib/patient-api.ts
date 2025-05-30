import { getApiClient } from './api'
import { useSession } from 'next-auth/react'
import { PaginatedPatientListList } from '@frontend/types/api/models/PaginatedPatientListList'
import { PaginatedPatientCustomFieldList, PatientCreate, PatchedPatientCreate, PatientCustomFieldCreate } from '@frontend/types/api'

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

export async function updatePatient(
  id: number,
  patientData: PatchedPatientCreate,
  session?: any
): Promise<any> {
  try {
    const api = await getApiClient(session)
    const response = await api.patients.patientsPartialUpdate(id, patientData)
    return response
  } catch (error) {
    console.error('Error updating patient:', error)
    throw error
  }
}

export async function createCustomField(
  customFieldData: PatientCustomFieldCreate,
  session?: any
): Promise<any> {
  try {
    const api = await getApiClient(session)
    const response = await api.customFields.customFieldsCreate(customFieldData)
    return response
  } catch (error) {
    console.error('Error creating custom field:', error)
    throw error
  }
} 

export async function deleteCustomField(
  id: number,
  session?: any
): Promise<any> {
  try {
    const api = await getApiClient(session)
    const response = await api.customFields.customFieldsDestroy(id)
    return response
  } catch (error) {
    console.error('Error deleting custom field:', error)
    throw error
  }
}

export function usePatientApi() {
  const { data: session } = useSession()
  return { session }
} 