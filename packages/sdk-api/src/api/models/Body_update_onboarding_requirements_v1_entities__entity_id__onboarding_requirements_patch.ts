/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TosAcceptance } from './TosAcceptance';

export type Body_update_onboarding_requirements_v1_entities__entity_id__onboarding_requirements_patch = {
    tos_acceptance?: TosAcceptance;
    verification_document_front?: Blob;
    verification_document_back?: Blob;
    additional_verification_document_front?: Blob;
    additional_verification_document_back?: Blob;
    bank_account_ownership_verification?: Array<Blob>;
    company_license?: Array<Blob>;
    company_memorandum_of_association?: Array<Blob>;
    company_ministerial_decree?: Array<Blob>;
    company_registration_verification?: Array<Blob>;
    company_tax_id_verification?: Array<Blob>;
    proof_of_registration?: Array<Blob>;
};

