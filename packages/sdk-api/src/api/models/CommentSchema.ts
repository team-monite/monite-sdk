/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FileSchema } from './FileSchema';
import type { MentionSchema } from './MentionSchema';
import type { StatusEnum } from './StatusEnum';

export type CommentSchema = {
    id: string;
    entity_id: string;
    status: StatusEnum;
    entity_user_id: string;
    api_user_id?: string;
    partner_id?: string;
    object_id: string;
    object_type: string;
    text: string;
    mentions?: Array<MentionSchema>;
    replies_to?: string;
    attachments?: Array<FileSchema>;
    edited_at?: string;
    created_at?: string;
};

