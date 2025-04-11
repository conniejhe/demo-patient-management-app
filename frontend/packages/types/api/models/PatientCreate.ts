/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatientAddressCreate } from './PatientAddressCreate';
import type { PatientCustomFieldValueCreate } from './PatientCustomFieldValueCreate';
import type { StatusEnum } from './StatusEnum';
/**
 * Serializer for creating/updating patients with detailed address fields.
 */
export type PatientCreate = {
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    date_of_birth: string;
    status?: StatusEnum;
    addresses: Array<PatientAddressCreate>;
    custom_field_values?: Array<PatientCustomFieldValueCreate>;
};

