/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EntityOnboardingDocuments = {
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
