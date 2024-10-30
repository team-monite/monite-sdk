/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type { CancelablePromise } from '../CancelablePromise';
import type { FileResponse } from '../models/FileResponse';
import type { FilesResponse } from '../models/FilesResponse';
import type { UploadFile } from '../models/UploadFile';
import { request as __request } from '../request';
import { CommonService } from './CommonService';

export class FilesService extends CommonService {
  /**
   * Get a files by ID
   * @param idIn
   * @returns FilesResponse Successful Response
   * @throws ApiError
   */
  public getAll(idIn: Array<string>): CancelablePromise<FilesResponse> {
    return __request(
      {
        method: 'GET',
        url: '/files',
        query: {
          id__in: idIn,
        },
        errors: {
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Upload a file
   * @param formData
   * @returns FileResponse Successful Response
   * @throws ApiError
   */
  public create(formData: UploadFile): CancelablePromise<FileResponse> {
    return __request(
      {
        method: 'POST',
        url: '/files',
        formData: formData,
        mediaType: 'multipart/form-data',
        errors: {
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Get a file by ID
   * @param fileId
   * @returns FileResponse Successful Response
   * @throws ApiError
   */
  public getById(fileId: string): CancelablePromise<FileResponse> {
    return __request(
      {
        method: 'GET',
        url: '/files/{file_id}',
        path: {
          file_id: fileId,
        },
        errors: {
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }

  /**
   * Delete a file
   * @param fileId
   * @returns void
   * @throws ApiError
   */
  public deleteById(fileId: string): CancelablePromise<void> {
    return __request(
      {
        method: 'DELETE',
        url: '/files/{file_id}',
        path: {
          file_id: fileId,
        },
        errors: {
          405: `Method Not Allowed`,
          422: `Validation Error`,
          500: `Internal Server Error`,
        },
      },
      this.openApi
    );
  }
}
