/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedPatientCustomFieldList } from '../models/PaginatedPatientCustomFieldList';
import type { PatchedPatientCustomField } from '../models/PatchedPatientCustomField';
import type { PatientCustomField } from '../models/PatientCustomField';
import type { PatientCustomFieldCreate } from '../models/PatientCustomFieldCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CustomFieldsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * ViewSet for managing custom fields.
     *
     * Provides CRUD operations for custom fields.
     * @param page A page number within the paginated result set.
     * @returns PaginatedPatientCustomFieldList
     * @throws ApiError
     */
    public customFieldsList(
        page?: number,
    ): CancelablePromise<PaginatedPatientCustomFieldList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/custom-fields/',
            query: {
                'page': page,
            },
        });
    }
    /**
     * ViewSet for managing custom fields.
     *
     * Provides CRUD operations for custom fields.
     * @param requestBody
     * @returns PatientCustomFieldCreate
     * @throws ApiError
     */
    public customFieldsCreate(
        requestBody: PatientCustomFieldCreate,
    ): CancelablePromise<PatientCustomFieldCreate> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/custom-fields/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * ViewSet for managing custom fields.
     *
     * Provides CRUD operations for custom fields.
     * @param id A unique integer value identifying this custom field.
     * @returns PatientCustomField
     * @throws ApiError
     */
    public customFieldsRetrieve(
        id: number,
    ): CancelablePromise<PatientCustomField> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/custom-fields/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * ViewSet for managing custom fields.
     *
     * Provides CRUD operations for custom fields.
     * @param id A unique integer value identifying this custom field.
     * @param requestBody
     * @returns PatientCustomField
     * @throws ApiError
     */
    public customFieldsUpdate(
        id: number,
        requestBody: PatientCustomField,
    ): CancelablePromise<PatientCustomField> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/custom-fields/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * ViewSet for managing custom fields.
     *
     * Provides CRUD operations for custom fields.
     * @param id A unique integer value identifying this custom field.
     * @param requestBody
     * @returns PatientCustomField
     * @throws ApiError
     */
    public customFieldsPartialUpdate(
        id: number,
        requestBody?: PatchedPatientCustomField,
    ): CancelablePromise<PatientCustomField> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/custom-fields/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * ViewSet for managing custom fields.
     *
     * Provides CRUD operations for custom fields.
     * @param id A unique integer value identifying this custom field.
     * @returns void
     * @throws ApiError
     */
    public customFieldsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/custom-fields/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
