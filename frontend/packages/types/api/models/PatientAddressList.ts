/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressTypeEnum } from './AddressTypeEnum';
import type { StateEnum } from './StateEnum';
export type PatientAddressList = {
    address_type: AddressTypeEnum;
    readonly full_address: string;
    street_address: string;
    city: string;
    state: StateEnum;
    postal_code: string;
    is_primary: boolean;
};

