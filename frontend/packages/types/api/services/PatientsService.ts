/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedPatientListList } from '../models/PaginatedPatientListList';
import type { PatchedPatientCreate } from '../models/PatchedPatientCreate';
import type { PatientCreate } from '../models/PatientCreate';
import type { PatientList } from '../models/PatientList';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PatientsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * ViewSet for managing patient records.
     *
     * Provides CRUD operations for patients and their related data.
     * @param page A page number within the paginated result set.
     * @returns PaginatedPatientListList
     * @throws ApiError
     */
    public patientsList(
        page?: number,
    ): CancelablePromise<PaginatedPatientListList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/patients/',
            query: {
                'page': page,
            },
        });
    }
    /**
     * ViewSet for managing patient records.
     *
     * Provides CRUD operations for patients and their related data.
     * @param requestBody
     * @returns PatientCreate
     * @throws ApiError
     */
    public patientsCreate(
        requestBody: PatientCreate,
    ): CancelablePromise<PatientCreate> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/patients/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * ViewSet for managing patient records.
     *
     * Provides CRUD operations for patients and their related data.
     * @param id A unique integer value identifying this patient.
     * @returns PatientList
     * @throws ApiError
     */
    public patientsRetrieve(
        id: number,
    ): CancelablePromise<PatientList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/patients/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * ViewSet for managing patient records.
     *
     * Provides CRUD operations for patients and their related data.
     * @param id A unique integer value identifying this patient.
     * @param requestBody
     * @returns PatientCreate
     * @throws ApiError
     */
    public patientsUpdate(
        id: number,
        requestBody: PatientCreate,
    ): CancelablePromise<PatientCreate> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/patients/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * ViewSet for managing patient records.
     *
     * Provides CRUD operations for patients and their related data.
     * @param id A unique integer value identifying this patient.
     * @param requestBody
     * @returns PatientCreate
     * @throws ApiError
     */
    public patientsPartialUpdate(
        id: number,
        requestBody?: PatchedPatientCreate,
    ): CancelablePromise<PatientCreate> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/patients/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * ViewSet for managing patient records.
     *
     * Provides CRUD operations for patients and their related data.
     * @param id A unique integer value identifying this patient.
     * @returns void
     * @throws ApiError
     */
    public patientsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/patients/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
