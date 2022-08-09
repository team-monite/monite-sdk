/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentObjectTypeEnum } from './DocumentObjectTypeEnum';

export type ContentResponse = {
    /**
     * ID of email content
     */
    id: string;
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
    /**
     * Content created date and time
     */
    created_at: string;
    /**
     * Content updated date and time
     */
    updated_at: string;
};

