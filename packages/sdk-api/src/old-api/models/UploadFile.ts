/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { AllowedFileTypes } from './AllowedFileTypes';

export type UploadFile = {
  file: Blob;
  file_type: AllowedFileTypes;
};
