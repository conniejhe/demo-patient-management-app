/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatientAddressList } from './PatientAddressList';
import type { PatientCustomFieldValueList } from './PatientCustomFieldValueList';
import type { StatusEnum } from './StatusEnum';
/**
 * Serializer for listing patients in a table view with simplified address display.
 */
export type PatientList = {
    readonly id: number;
    readonly full_name: string;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    date_of_birth: string;
    status?: StatusEnum;
    readonly created_at: string;
    addresses: Array<PatientAddressList>;
    custom_field_values: Array<PatientCustomFieldValueList>;
};

