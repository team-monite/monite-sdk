/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentObjectTypeEnum } from './DocumentObjectTypeEnum';

export type CreateContentRequest = {
    /**
     * Document type of content
     */
    document_type: DocumentObjectTypeEnum;
    /**
     * Subject text of the content
     */
    subject: string;
    /**
     * Body text of the content
     */
    body: string;
    /**
     * Name of the content
     */
    name?: string;
};
