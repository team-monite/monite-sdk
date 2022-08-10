/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentObjectTypeEnum } from './DocumentObjectTypeEnum';

export type SendEmailByDocumentSchema = {
    /**
     * Partner ID
     */
    entity_id: string;
    document_type: DocumentObjectTypeEnum;
    /**
     * Subject text of the template
     */
    subject: string;
    /**
     * Body text of the template
     */
    body: string;
    /**
     * Key/value variables for putting in the template
     */
    data: any;
    recipients: Array<string>;
};

